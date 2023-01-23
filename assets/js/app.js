import { cars, cities } from "./utils.js";

const selectBoxes = document.querySelectorAll(".select");

const dataForFilter = {};

const selected = (id, toggle = false) => {
    selectBoxes.forEach((item) => {
        if (item.id == id) {
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

const open = (id, toggle = false) => {
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
    const selected = selectBox.querySelector(".select-input");

    container.innerHTML = "";
    container.append(resetItem());
    list.map((item) => {
        const listItem = document.createElement("li");
        listItem.classList.add(item[key] == selected.value ? "selected-option" : "dropdown-option");
        listItem.textContent = item[key];
        listItem.addEventListener("click", (e) => {
            selected.value = e.target.textContent;
            if (key == "brand") {
                document.querySelector("#model-select").classList.remove("disabled");
                document.querySelector("#model-select .select-input").removeAttribute("disabled");


            }
        })

        container.append(listItem);
    });


};




document.querySelector("#model-dropdown")

selectBoxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (!box.classList.contains("disabled")) {
            selected(box.id);
            open(box.id);
        }
        switch (box.id) {
            case "brand-select":
                dropdownRender(cars, box, "brand");
                break;
            case "city-select":
                dropdownRender(cities, box, "cityName");
                break;
            case "model-select":
                const models = cars.find(car => car.brand == document.querySelector("#brand").value).models;
                document.querySelector("#model-dropdown").innerHTML = "";
                document.querySelector("#model-dropdown").append(resetItem());
                models.map(model => {
                    const listItem = document.createElement("li");
                    // listItem.classList.add(item[key] == selected.value ? "selected-option" : "dropdown-option");
                    listItem.textContent = model;
                    document.querySelector("#model-dropdown").append(listItem)
                }
                )
                break
            default:
                console.log("default");
                break;
        }
    });

    if (!box.classList.contains("disabled")) {
        box.querySelector(".chevron").addEventListener("click", (e) => {
            e.stopPropagation();
            selected(box.id, true);
            open(box.id, true);
            switch (box.id) {
                case "brand-select":
                    dropdownRender(cars, box, "brand");
                    break;
                case "city-select":
                    dropdownRender(cities, box, "cityName");
                    break;
                default:
                    console.log("default");
                    break;
            }
        });
    }


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
