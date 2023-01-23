import { cars, cities } from "./utils.js";

const selectBoxes = document.querySelectorAll(".select");

const dataForFilter = {};

const selected = (id, toggle = false) => {
    selectBoxes.forEach((item) => {
        if (item.id == id || item.querySelector(".select-input").value) {
            if (toggle) {
                item.classList.toggle("selected");
            } else {
                item.classList.add("selected");
            }
        } else {
            item.classList.remove("selected");
        }
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

const resetItem = () => {
    const listItem = document.createElement("li");
    const crossIcon = document.createElement("i");
    crossIcon.classList.add("fa-solid", "fa-xmark");
    const resetSpan = document.createElement("span");
    resetSpan.textContent = "Sıfırla";
    listItem.append(crossIcon, resetSpan);
    return listItem;
};

const dropdownRender = (list, selectBox, key) => {
    const container = selectBox.querySelector(".dropdown");

    container.innerHTML = "";
    container.append(resetItem());
    list.map((item) => {
        const listItem = document.createElement("li");
        listItem.classList.add(item[key] == dataForFilter[key] ? "selected-option" : "dropdown-option");
        listItem.textContent = item[key];
        listItem.addEventListener("click", (e) => {
            dataForFilter[key] = e.target.textContent;
            console.log(dataForFilter)
            selectBox.querySelector(".select-input").value = e.target.textContent;
            if (key == "brand") {
                document.querySelector("#model-select").classList.remove("disabled");
                document.querySelector("#model-select .select-input").removeAttribute("disabled");
                document.querySelector("#model").value = "";
            }
        })
        container.append(listItem);
    });
};


const modelsSelector = () => {
    if (dataForFilter.brand) {
        const models = cars.find(car => car.brand == dataForFilter.brand).models;
        document.querySelector("#model-dropdown").innerHTML = "";
        document.querySelector("#model-dropdown").append(resetItem());
        models.map(model => {
            const listItem = document.createElement("li");
            listItem.classList.add(model == dataForFilter.model ? "selected-option" : "dropdown-option");
            const label = document.createElement("label");
            label.for = model;
            label.textContent = model;
            const checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
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
        default:
            console.log("default");
            break;
    }

}


    selectBoxes.forEach(box => {

        if (box.querySelector(".select-input").value != "") {
            box.classList.add("selected");
            console.log("select click")
        }
        box.addEventListener("input", () => {
            const inputValue = box.querySelector(".select-input").value.trim().toLocaleLowerCase();
            const filteredArray = cars.filter(car => car.brand.toLocaleLowerCase().includes(inputValue))
            dropdownRender(filteredArray, box, "brand")
        });

        box.addEventListener("click", () => {
            dropdownToggleHandler(box, false)
        });

        box.querySelector(".chevron").addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownToggleHandler(box, true);
        });
    });


// const filteringForm = document.querySelector(".filtering-form")
// filteringForm.addEventListener("submit", (e)=>{
//     e.preventDefault();
//     const fieldsForFilter ={};
//     fieldsForFilter.brand = brandInput.value
//     console.log("submit", fieldsForFilter)
// })
// // brandSelect.addEventListener("click", (e)=>{
// //     document.querySelector(".placeholder").textContent = "Markanı yazın"
// // })
// // brandSelect.addEventListener("input", ()=>{
// //     document.querySelector(".placeholder").textContent = "Marka"
// // })
