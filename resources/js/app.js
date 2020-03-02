import Country from "./Country.js";
import {autocomplete} from "./autoCompleteSearchBar.js"


// get all country names for the search bar to autoComplete data and for random country
const getAllCountriesNames = async () => {
    const data = await fetch(`https://restcountries.eu/rest/v2/all`);
    const dataInJson = await data.json();
    return dataInJson.map(value => value.name);
};

// update the DOM to insert the new country box
const renderView = countryDetails => {
    const markup = `
       <div class="col span-1-of-${colType}">
            <div class="country_details_box">
                <img src="${countryDetails.flag}" alt="pic">
                <ul>
                    <li><i class="ion-information small-icon"></i><label><strong>Name:</strong> </label>${countryDetails.name.length > 18 ? `${countryDetails.name.slice(0, 18)}...` : countryDetails.name}</li>
                    <li><i class="ion-code small-icon"></i><label><strong>Code:</strong> </label>${countryDetails.code}</li>
                    <li><i class="ion-android-globe small-icon"></i><label><strong>Region:</strong> </label>${countryDetails.region}</li>
                    <li><i class="ion-home small-icon"></i><label><strong>Capital:</strong> </label>${countryDetails.capital}</li>
                </ul>
            </div>
       </div>
       `;

    selectedCountries.push(markup); // insert to the global array
    insertDivsToDOM(selectedCountries, true);
};

const insertDivsToDOM = (selectedCountriesFinal, isAnimated) => {
    const selectedCountriesFinal2 = classifyLastFinalBoxAndFixRow(selectedCountriesFinal, isAnimated);
    document.querySelector('.country-boxes').innerHTML = '';
    document.querySelector('.country-boxes').innerHTML = selectedCountriesFinal2.join('');
};

// insert a new row after 4 country + the last country box get final class for animation
const classifyLastFinalBoxAndFixRow = (selectedCountries, isAnimated) => {
    let currentCountry = '';
    const selectedCountriesAfterClassify = [];
    for (let i = 0; i < selectedCountries.length; i++) {
        if (i === 0 || i % colType !== 0) {
            if (isAnimated && i === selectedCountries.length - 1) {
                currentCountry += selectedCountries[i].replace('country_details_box', 'country_details_box final');
            } else {
                currentCountry += selectedCountries[i];
            }
        } else {
            currentCountry = `<div class="row-full">${currentCountry}</div>`;
            selectedCountriesAfterClassify.push(currentCountry);
            if (isAnimated && i === selectedCountries.length - 1) {
                currentCountry = selectedCountries[i].replace('country_details_box', 'country_details_box final');
            } else {
                currentCountry = selectedCountries[i];
            }
        }
        if (i === selectedCountries.length - 1) {
            selectedCountriesAfterClassify.push(`<div class="row-full">${currentCountry}</div>`);
        }
    }
    return selectedCountriesAfterClassify;
};


// get random country - button listener
document.getElementById('random_country').addEventListener('click', el => {
    el.preventDefault(); // prevent from page to reload
    if (countries.length !== 0) {
        const randomCountry = new Country(countries[Math.floor(Math.random() * countries.length)]);
        randomCountry.getCountry().then(value => {
            renderView(randomCountry);
        })
    }
});

// button listener - delete all countries from DOM
document.getElementById('delete_all_data').addEventListener('click', el => {
    el.preventDefault(); // prevent from page to reload
    document.querySelector('.country-boxes').innerHTML = '';
    selectedCountries = [];
});

// button listener -
document.getElementById('get_country').addEventListener('click', el => {
    el.preventDefault(); // prevent from page to reload
    const valueFromInput = document.getElementById("myInput").value;
    if (valueFromInput !== '') {
        const countryFromSearch = new Country(valueFromInput);
        countryFromSearch.getCountry().then(value => {
            renderView(countryFromSearch);
        });
    }
});

// update column of box country
window.addEventListener('resize', function (event) {
    colType = setColType(event.target.innerWidth);
    selectedCountries = selectedCountries.map(value => value.replace(/span-1-of-[1-5]/g, `span-1-of-${colType}`));
    insertDivsToDOM(selectedCountries, false);
});

const setColType = (windowWidth) => {
    if (windowWidth >= 2000) {
        return colTypeObj.fiveColumn;
    } else if (windowWidth < 2000 && windowWidth >= 1300) {
        return colTypeObj.fourColumn;
    } else if (windowWidth < 1300 && windowWidth >= 1000) {
        return colTypeObj.threeColumn;
    } else if (windowWidth < 1000 && windowWidth >= 700) {
        return colTypeObj.twoColumn;
    } else if (windowWidth < 700 && windowWidth >= 0) {
        return colTypeObj.oneColumn;
    }
};

const createAutocompleteForSearchBar=()=>{
    getAllCountriesNames().then(value => {
        countries = value;
        autocomplete(document.getElementById("myInput"), countries);
    }).catch(reason => {
        document.getElementById('myInput').placeholder = 'Unable load countries';
    });

};



// Main //
const colTypeObj = {'oneColumn': 1, 'twoColumn': 2, 'threeColumn': 3, 'fourColumn': 4, 'fiveColumn': 5};
Object.freeze(colTypeObj);
let countries = [];
let selectedCountries = [];
let colType = setColType(window.innerWidth);

createAutocompleteForSearchBar();

