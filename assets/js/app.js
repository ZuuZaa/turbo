import { cars, cities, banType, years } from "./utils.js";
import { data } from "./data.js";

const selectBoxes = document.querySelectorAll(".select");
const creditChekbox = document.querySelector("#credit-checkbox");
const barterChekbox = document.querySelector("#barter-checkbox");

const selected = (id, toggle = false) => {
    selectBoxes.forEach((item) => {
        if (item.querySelector(".select-input").value && !item.classList.contains("not-selected")) item.classList.add("selected");
        else {
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
    if (!box.classList.contains("disabled")) {
        selected(box.id, toogle);
        open(box.id, toogle);
    }
    
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

}

const formReset = form => {
    form.reset();
    document.querySelectorAll(".input-container").forEach(box => {
        box.id == "currency-select" && box.classList.add("not-selected")
        box.classList.remove("selected", "open", "typing")
        box.id == "model-select" && box.classList.add("disabled");
        box.id == "barter-checkbox" && box
    })
    document.querySelector("#model").setAttribute("disabled", "");
    document.querySelector("#credit-checkbox").classList.remove("selected-checkbox");
    document.querySelector("#barter-checkbox").classList.remove("selected-checkbox");
}



selectBoxes.forEach(box => {

    box.addEventListener("input", () => {
        box.classList.add("typing");
    //     const inputValue = box.querySelector(".select-input").value.trim().toLocaleLowerCase();
    //     switch (box.id) {
    //         case "brand-select":
    //             const filteredCars = cars.filter(car => car.brand.toLocaleLowerCase().startsWith(inputValue))
    //             dropdownRender(filteredCars, box, "brand")
    //             break;
    //         case "city-select":
    //             const filteredCities = cities.filter(item => item.cityName.toLocaleLowerCase().startsWith(inputValue))
    //             dropdownRender(filteredCities, box, "cityName")
    //             break;
    //         case "model-select":
    //             modelsSelector(inputValue.toLocaleLowerCase());
    //             break;
    //         default:
    //             console.log("default");
    //             break;
    //     }
    });

    box.addEventListener("click", () => {
        
        dropdownToggleHandler(box, false)
    });

    box.querySelector(".chevron").addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownToggleHandler(box, true);
    });
});

document.querySelector(".price-select").addEventListener("click", (e) => {
    document.querySelectorAll(".price-input").forEach(item => {
        if (item.id == e.target.id) item.parentNode.classList.add("selected")
        else {
            if (!item.value) item.parentNode.classList.remove("selected")
        }

    })
})


barterChekbox.addEventListener("click", () => checkboxButton(barterChekbox))
creditChekbox.addEventListener("click", () => checkboxButton(creditChekbox))


const cardCreator = item => {
    const card = document.createElement("div");
    card.classList.add("card");
    const cardImg = document.createElement("div");
    cardImg.classList.add("card-img");
    const img = document.createElement("img");
    img.src = item.images[0];
    cardImg.append(img);
    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");
    const carPrice = document.createElement("h2");
    carPrice.classList.add("card-price");
    carPrice.textContent = `${item.price} ${item.currency}`
    const carBrand = document.createElement("h3");
    carBrand.classList.add("card-brand");
    carBrand.textContent =`${item.brand} ${item.model}`
    const carYear = document.createElement("p");
    carYear.classList.add("card-year");
    carYear.textContent = `${item.year} il, ${item.odometer} km`
    const city = document.createElement("small");
    city.textContent = item.city
    cardContent.append(carPrice, carBrand, carYear, city)
    card.append(cardImg, cardContent)
    return card;
}

const dataRender = list => {
    const container = document.querySelector(".cars-container");
    container.innerHTML = ""
    list.forEach(item => {
        const card = cardCreator(item)
        container.append(card)
    })
}

dataRender(data);


const filteringForm = document.querySelector(".filtering-form")
filteringForm.addEventListener("submit", (e) => {

    e.preventDefault();
    console.log(!document.querySelector(".currency-select").classList.contains("not-selected"))

    const brand = document.querySelector("#brand").value;
    const models = document.querySelector("#model").value.split(", ");
    const driven = document.querySelector("input[name=driven]:checked").value;
    const cities = document.querySelector("#city").value.split(", ");
    const minPrice = +document.querySelector("#min-price").value;
    const maxPrice = +document.querySelector("#max-price").value;
    const currency = !document.querySelector(".currency-select").classList.contains("not-selected") && document.querySelector("#currency").value;
    const credit = document.querySelector("#credit").checked;
    const barter = document.querySelector("#barter").checked;
    const ban = document.querySelector("#ban").value.split(", ");
    const minYear = document.querySelector("#min-year").value;
    const maxYear = document.querySelector("#max-year").value;

    const brandFiltered = data.filter(car => car.brand == brand)
    const modelFiltered = brandFiltered.filter(car => models.includes(car.model));
    const drivenFiltered = driven == "driven" ? data.filter(car => car.odometer != 0) : driven == "not driven" ? data.filter(car => car.odometer == 0) : []
    const priceFiltered =
        minPrice != 0 && maxPrice != 0 ? data.filter(car => car.price >= minPrice && car.price <= maxPrice)
            : minPrice == 0 && maxPrice != 0 ? data.filter(car => car.price <= maxPrice)
                : minPrice != 0 && maxPrice == 0 ? data.filter(car => car.price >= minPrice)
                    : []
    const cityFiltered = data.filter(car => cities.includes(car.city));
    const currencyFiltered = data.filter(car => car.currency == currency)
    const creditFiltered = credit ? data.filter(car => car.credit == true) : []
    const barterFiltered = barter ? data.filter(car => car.barter == true) : []
    const banFiltered = data.filter(car => ban.includes(car.banType));
    const yearsFiltered =
        minYear != 0 && maxYear != 0 ? data.filter(car => +car.year >= minYear && +car.year <= maxYear)
            : minYear == 0 && maxYear != 0 ? data.filter(car => car.year <= maxYear)
                : minYear != 0 && maxYear == 0 ? data.filter(car => car.year >= minYear)
                    : []

    let filteredArr = [
        ...brandFiltered,
        ...modelFiltered,
        ...drivenFiltered,
        ...cityFiltered,
        ...priceFiltered,
        ...currencyFiltered,
        ...creditFiltered,
        ...barterFiltered,
        ...banFiltered,
        ...yearsFiltered
    ];

    const dataForRender = new Set(filteredArr)
    dataRender(dataForRender);
    console.log(dataForRender)
    formReset(e.target)
})

filteringForm.addEventListener("reset", (e) => {
    formReset(e.target)
})
