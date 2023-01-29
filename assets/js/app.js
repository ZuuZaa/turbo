import { cars, cities, banType, years } from "./utils.js";

const selectBoxes = document.querySelectorAll(".select");

const dataForFilter = {
    // brand: null,
    // model: null,
    // driven: null,
    // cityName: null,
    // maxPrice: null,
    // minPrice: null,
    // currency: null,
    // credit: null,
    // barter: null,
    // banType: null,
    // minYear: null,
    // maxYear: null
};

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
    });
};

const open = (id, toggle) => {
    selectBoxes.forEach((item) => {
        if (item.id == id) {
            // item.querySelector(".select-input").focus()
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
            // item.querySelector(".select-input").blur()

        }
    });
};

const resetItem = (box) => {
    const listItem = document.createElement("li");
    const crossIcon = document.createElement("i");
    crossIcon.classList.add("fa-solid", "fa-xmark");
    const resetSpan = document.createElement("span");
    resetSpan.textContent = "Sıfırla";
    listItem.classList.add("reset-dropdown");
    listItem.append(crossIcon, resetSpan);
    listItem.addEventListener("click", () => {
        selected(box.id);
        box.querySelector(".select-input").value = "";
    })
    return listItem;
};

const dropdownRender = (list, selectBox, key) => {
    const container = selectBox.querySelector(".dropdown");
    container.innerHTML = "";

    if (list.length > 0) {
        container.append(resetItem(selectBox));
        list.map((item) => {
            const listItem = document.createElement("li");
            listItem.textContent = (key == "minYear" || key == "maxYear") ? item.year : item[key];
            (key == "minYear" || key == "maxYear")
                ? listItem.classList.add(item.year == dataForFilter[key] ? "selected-option" : "dropdown-option")
                : listItem.classList.add(item[key] == dataForFilter[key] ? "selected-option" : "dropdown-option");
            listItem.addEventListener("click", (e) => {
                dataForFilter[key] = e.target.textContent;
                selectBox.querySelector(".select-input").value = e.target.textContent;
                console.log(selectBox.classList)
                if (key == "brand") {
                    document.querySelector("#model-select").classList.remove("disabled");
                    document.querySelector("#model-select .select-input").removeAttribute("disabled");
                    document.querySelector("#model").value = "";
                }
            })
            container.append(listItem);
        });
    } else {
        const listItem = document.createElement("li");
        listItem.textContent = "Tapılmadı"
        container.append(listItem);
    }

};


const modelsSelector = (filter = false) => {
    if (dataForFilter.brand) {
        document.querySelector("#model-dropdown").innerHTML = "";
        document.querySelector("#model-dropdown").append(resetItem(document.querySelector("#model-select")));
        const arr = cars.find(car => car.brand == dataForFilter.brand).models;
        const models = filter ? arr.filter(item => item.toLocaleLowerCase().includes(filter)) : arr;
        models.map(model => {
            const listItem = document.createElement("li");
            listItem.classList.add(model == dataForFilter.model ? "selected-option" : "dropdown-option");
            const label = document.createElement("label");
            label.for = model;
            label.textContent = model;
            const checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.classList.add("model-checkbox");
            checkbox.id = model;
            checkbox.value = model;
            if (checkbox.value == dataForFilter.model) checkbox.setAttribute("checked", "checked")
            listItem.append(label, checkbox);
            listItem.addEventListener("click", () => {
                document.querySelector("#model").value = model;
                dataForFilter.model = model
            })
            document.querySelector("#model-dropdown").append(listItem)
        })
    }
}


const dropdownToggleHandler = (box, toogle) => {
    if (!box.classList.contains("disabled")) {
        selected(box.id, toogle);
        open(box.id, toogle);
    }
    switch (box.id) {
        case "brand-select":
            dropdownRender(cars, box, "brand");
            break;
        case "city-select":
            dropdownRender(cities, box, "cityName");
            break;
        case "model-select":
            modelsSelector();
            break
        case "ban-select":
            dropdownRender(banType, box, "banType");
            break;
        case "min-year-select":
            dropdownRender(years, box, "minYear");
            break
        case "max-year-select":
            dropdownRender(years, box, "maxYear");
            break
        default:
            console.log("default");
            break;
    }
}


const formReset = form => {
    form.reset();
    selectBoxes.forEach(box=> {
        box.classList.remove("selected")
    })
    Object.keys(dataForFilter).forEach(key => {
        delete dataForFilter[key];
      });
      document.querySelector("#model-select").classList.add("disabled");
      document.querySelector("#model-select .select-input").setAttribute("disabled", "")
      document.querySelector("#model-select .chevron").classList.remove("rotated");
      console.log(dataForFilter)
}

selectBoxes.forEach(box => {

    box.addEventListener("input", () => {
        const inputValue = box.querySelector(".select-input").value.trim().toLocaleLowerCase();
        switch (box.id) {
            case "brand-select":
                const filteredCars = cars.filter(car => car.brand.toLocaleLowerCase().startsWith(inputValue))
                dropdownRender(filteredCars, box, "brand")
                break;
            case "city-select":
                const filteredCities = cities.filter(item => item.cityName.toLocaleLowerCase().startsWith(inputValue))
                dropdownRender(filteredCities, box, "cityName")
                break;
            case "model-select":
                modelsSelector(inputValue.toLocaleLowerCase());
                break;
            default:
                console.log("default");
                break;
        }
    });

    box.addEventListener("click", (e) => {
        dropdownToggleHandler(box, false)
        if (e.target.tagName == "LI" || e.target.tagName == "LABEL" || e.target.classList.contains("model-checkbox") && !e.target.classList.contains("reset-dropdown")) box.classList.remove("open");

        if (box.id == "currency-select") {
            dataForFilter.currency = box.querySelector(".select-input").value;
        }
        console.log(dataForFilter)

    });

    box.querySelector(".chevron").addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownToggleHandler(box, true);
    });
});

document.querySelectorAll("#currency-select ul li").forEach(item => item.addEventListener("click", (e) => {
    document.querySelector("#currency-select > .select-input").value = e.target.textContent;
    document.querySelector("#currency-select").classList.remove("not-selected")
}))

document.querySelectorAll(".radio").forEach(btn => {
    btn.addEventListener("click", e => dataForFilter.driven = e.target.control.value);
})


const filteringForm = document.querySelector(".filtering-form")
filteringForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    
    // fieldsForFilter.brand = brandInput.value
    console.log("submit", dataForFilter);
    formReset(e.target)
})

filteringForm.addEventListener("reset", (e)=>{
    formReset(e.target)
})


// // brandSelect.addEventListener("click", (e)=>{
// //     document.querySelector(".placeholder").textContent = "Markanı yazın"
// // })


// brandSelect.addEventListener("input", ()=>{
//     document.querySelector(".placeholder").textContent = "Marka"
// })
