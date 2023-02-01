import { cars, cities, banType, years } from "./utils.js";
import { data } from "./data.js";

const selectBoxes = document.querySelectorAll(".select");
const creditChekbox = document.querySelector("#credit-checkbox");
const barterChekbox = document.querySelector("#barter-checkbox");

const selected = (id, toggle = false) => {
    selectBoxes.forEach((item) => {
        if (item.querySelector(".select-input").value && !item.classList.contains("not-selected")) item.classList.add("selected");
        else {
            //console.log("else", id,item.querySelector(".select-input").value)
            if (item.id == id) {
                if (toggle) {
                    item.classList.toggle("selected");
                } else {
                    item.classList.add("selected");
                }
            } else {
                item.classList.remove("selected");
            }
        }
        !item.querySelector(".select-input").value && item.classList.remove("typing")
    });
};

const open = (id, toggle) => {
    selectBoxes.forEach((item) => {
        if (item.id == id) {
            if (toggle) {
                item.classList.toggle("open");
                item.querySelector(".chevron").classList.toggle("rotated");
            } else {
                item.classList.add("open");
                item.querySelector(".chevron").classList.add("rotated");
            }
        } else {
            item.classList.remove("open");
            item.querySelector(".chevron").classList.remove("rotated");

        }
    });
};

const resetItem = (box) => {
    box.querySelector(".dropdown").innerHTML = "";
    const listItem = document.createElement("li");
    const crossIcon = document.createElement("i");
    crossIcon.classList.add("fa-solid", "fa-xmark");
    listItem.textContent = "Sıfırla";
    listItem.classList.add("reset-dropdown");
    listItem.prepend(crossIcon);
    listItem.addEventListener("click", () => {
        selected(box.id);
        box.querySelector(".select-input").value = "";
        box.id == "brand-select" && disabledModelSelect();
    })
    box.querySelector(".dropdown").append(listItem);
};

const disabledModelSelect = () => {
    const trigger = document.querySelector("#brand-select");
    const target = document.querySelector("#model-select");
    if (trigger.querySelector(".select-input").value) {
        target.classList.remove("disabled");
        target.querySelector(".select-input").removeAttribute("disabled");
    } else {
        target.classList.add("disabled");
        target.querySelector(".select-input").setAttribute("disabled", "");
    }
    target.querySelector(".select-input").value = "";
}

const radioListItem = (box, item, key) => {

    const content = key === "brand" ? item[key] : item;
    const text = `${key}-${content.toLocaleLowerCase().replace(" ", "-")}`

    const listItem = document.createElement("li");
    const label = document.createElement("label");
    label.setAttribute("for", text);
    label.textContent = content;

    const radioInput = document.createElement("input");
    radioInput.id = text;
    radioInput.setAttribute("type", "radio");
    radioInput.value = content;
    radioInput.checked = box.querySelector(".select-input").value == content
    radioInput.name = key;

    listItem.addEventListener("click", (e) => {
        e.stopPropagation()
        box.querySelector(`#${key}`).value = content
        box.classList.remove("open");
        if (key === "brand") {
            const modelSelect = document.querySelector("#model-select")
            const models = cars.find(car => car[key] == item[key]).models
            disabledModelSelect();
            resetItem(modelSelect);
            models.forEach(
                model => modelSelect.querySelector(".dropdown").append(checkboxListItem(modelSelect, model))
            )
        }
    })
    listItem.append(label, radioInput);
    return listItem;
}

const checkboxListItem = (box, item) => {

    const listItem = document.createElement("li");
    listItem.classList.add("select-checkbox");

    const label = document.createElement("label");
    label.setAttribute("for", item.toLocaleLowerCase().replace(" ", "-"));
    label.classList.add("checkbox-label");
    label.textContent = item;

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.id = item.toLocaleLowerCase().replace(" ", "-");
    checkbox.setAttribute("value", item);
    checkbox.checked = box.querySelector(".select-input").value.includes(item);

    listItem.addEventListener("click", (e) => {
        const checkedArr = []
        e.stopPropagation();
        box.querySelectorAll("input[type=checkbox]:checked").forEach(inp => checkedArr.push(inp.value))
        box.querySelector(".select-input").value = checkedArr.join(", ");
    })
    listItem.append(label, checkbox);

    return listItem
}

const checkboxButton = (box) => {
    box.querySelector("input[type=checkbox]").checked
        ? box.classList.add("selected-checkbox")
        : box.classList.remove("selected-checkbox");
}

// const dropdownRender = (list, selectBox, key) => {
//     const container = selectBox.querySelector(".dropdown");
//     container.innerHTML = "";

//     if (list.length > 0) {
//         container.append(resetItem(selectBox));
//         list.map((item) => {
//             const listItem = document.createElement("li");
//             listItem.textContent = (key == "minYear" || key == "maxYear") ? item.year : item[key];
//             (key == "minYear" || key == "maxYear")
//                 ? listItem.classList.add(item.year == dataForFilter[key] ? "selected-option" : "dropdown-option")
//                 : listItem.classList.add(item[key] == dataForFilter[key] ? "selected-option" : "dropdown-option");
//             listItem.addEventListener("click", (e) => {
//                 dataForFilter[key] = e.target.textContent;
//                 selectBox.querySelector(".select-input").value = e.target.textContent;
//                 if (key == "brand") {
//                     document.querySelector("#model-select").classList.remove("disabled");
//                     document.querySelector("#model-select .select-input").removeAttribute("disabled");
//                     document.querySelector("#model").value = "";
//                 }
//             })
//             container.append(listItem);
//         });
//     } else {
//         const listItem = document.createElement("li");
//         listItem.textContent = "Tapılmadı"
//         container.append(listItem);
//     }

// };

const dropdownToggleHandler = (box, toogle) => {

    switch (box.id) {
        case "brand-select":
            resetItem(box);
            cars.forEach(car => box.querySelector(".dropdown").append(radioListItem(box, car, "brand")))
            break;
        case "city-select":
            resetItem(box);
            cities.forEach(city => box.querySelector(".dropdown").append(checkboxListItem(box, city)))
            break;
        case "model-select":
            resetItem(box);
            const brand = document.querySelector("#brand").value;
            const models = cars.find(car => car.brand == brand)?.models
            models?.forEach(model => box.querySelector(".dropdown").append(checkboxListItem(box, model)))
            break
        case "ban-select":
            resetItem(box);
            banType.forEach(ban => box.querySelector(".dropdown").append(checkboxListItem(box, ban)))
            break;
        case "min-year-select":
            resetItem(box);
            years.reverse().forEach(year => box.querySelector(".dropdown").append(radioListItem(box, year, "min-year")))
            break
        case "max-year-select":

            resetItem(box);
            years.forEach(year => box.querySelector(".dropdown").append(radioListItem(box, year, "max-year")))
            break
        case "currency-select":
            box.querySelector("#currency").value = box.querySelector("input:checked").value;
            
            box.querySelector(".dropdown").addEventListener("click", () => box.classList.remove("not-selected"))
        default:
            console.log("default");
            break;
    }
    if (!box.classList.contains("disabled")) {
        selected(box.id, toogle);
        open(box.id, toogle);
    }
}

const formReset = form => {
    form.reset();
    selectBoxes.forEach(box => {
        box.id = "currency-select" && box.classList.add("not-selected")
        selected(box.id);
        open(box.id)
    })

    const dataForFilter = {};
    Object.keys(dataForFilter).forEach(key => {
        delete dataForFilter[key];
    });

    console.log(document.querySelector("#model-select"))
   // document.querySelector("#model-select").classList.add("disabled");
    document.querySelector("#model").setAttribute("disabled", "");
    document.querySelector("#credit-checkbox").classList.remove("selected-checkbox");
    document.querySelector("#barter-checkbox").classList.remove("selected-checkbox");

    console.log(dataForFilter)
}



selectBoxes.forEach(box => {

    box.addEventListener("input", () => {
        box.classList.add("typing");


        //const inputValue = box.querySelector(".select-input").value.trim().toLocaleLowerCase();
        // switch (box.id) {
        //     case "brand-select":
        //         const filteredCars = cars.filter(car => car.brand.toLocaleLowerCase().startsWith(inputValue))
        //         dropdownRender(filteredCars, box, "brand")
        //         break;
        //     case "city-select":
        //         const filteredCities = cities.filter(item => item.cityName.toLocaleLowerCase().startsWith(inputValue))
        //         dropdownRender(filteredCities, box, "cityName")
        //         break;
        //     case "model-select":
        //         modelsSelector(inputValue.toLocaleLowerCase());
        //         break;
        //     default:
        //         console.log("default");
        //         break;
        // }
    });

    box.addEventListener("click", (e) => {
        dropdownToggleHandler(box, false)
    });

    box.querySelector(".chevron").addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownToggleHandler(box, true);
    });
});

document.querySelector("#min-price").addEventListener(
    "click",()=> document.querySelector("#min-price").classList.add("selected", "typing")
)
barterChekbox.addEventListener("click", () => checkboxButton(barterChekbox))
creditChekbox.addEventListener("click", () => checkboxButton(creditChekbox))

const filteringForm = document.querySelector(".filtering-form")
filteringForm.addEventListener("submit", (e) => {

    e.preventDefault();

    let filteredArr = [];
    Object.keys(dataForFilter).forEach(key => {
        filteredArr = [...filteredArr, ...data.filter(car => car[key] == dataForFilter[key])]
    })
    new Set(filteredArr).forEach(
        item => console.log(item)
    )

    formReset(e.target)
})

filteringForm.addEventListener("reset", (e) => {
    formReset(e.target)
})

