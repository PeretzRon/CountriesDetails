// autocomplete search bar
export const autocomplete = (input, countriesList) => {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocomplete values:*/
    let currentFocus;
    /*execute a function when someone writes in the text field:*/
    input.addEventListener("input", function (e) {
        const valueFromInput = this.value;
        /*close any already open lists of autocomplete values*/
        closeAllLists();
        if (!valueFromInput) {
            return false;
        }

        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        const createDiv = document.createElement("DIV");
        createDiv.setAttribute("id", this.id + "autocomplete-list");
        createDiv.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(createDiv);
        /*for each item in the array...*/
        for (let i = 0; i < countriesList.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (countriesList[i].substr(0, valueFromInput.length).toUpperCase() === valueFromInput.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                const CreateSubDiv = document.createElement("DIV");
                /*make the matching letters bold:*/
                CreateSubDiv.innerHTML = `<strong>${countriesList[i].substr(0, valueFromInput.length)}</strong>`;
                CreateSubDiv.innerHTML += countriesList[i].substr(valueFromInput.length);
                /*insert a input field that will hold the current array item's value:*/
                CreateSubDiv.innerHTML += "<input type='hidden' value='" + countriesList[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                CreateSubDiv.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    input.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                createDiv.appendChild(CreateSubDiv);
            }
        }
    });

    /*execute a function presses a key on the keyboard:*/
    input.addEventListener("keydown", function (e) {
        let currentSelected = document.getElementById(this.id + "autocomplete-list");
        if (currentSelected) currentSelected = currentSelected.getElementsByTagName("div");
        if (e.keyCode === 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(currentSelected);
        } else if (e.keyCode === 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(currentSelected);
        } else if (e.keyCode === 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (currentSelected) currentSelected[currentFocus].click();
            }
        }
    });

    function addActive(item) {
        /*a function to classify an item as "active":*/
        if (!item) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(item);
        if (currentFocus >= item.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (item.length - 1);
        /*add class "autocomplete-active":*/
        item[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(item) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (let i = 0; i < item.length; i++) {
            item[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(element) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        const x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (element !== x[i] && element !== input) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
};