import Country from "./Country.js";
import {autocomplete} from "./autoCompleteSearchBar.js"

// get all country names for the search bar to autoComplete data and for random country
const getAllCountriesNames = async () => {
    const data = await fetch(`https://restcountries.eu/rest/v2/all`);
    const dataInJson = await data.json();
    return dataInJson.map(value => value.name);
};

// update the DOM to insert the new country box
const renderView = (countryDetails) => {
    const markup = `
       <div class="col span-1-of-4">
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
    const selectedCountriesFinal = classifyLastFinalBoxAndFixRow(selectedCountries);
    document.querySelector('.country-boxes').innerHTML = '';
    document.querySelector('.country-boxes').innerHTML = selectedCountriesFinal.join('');
};

// insert a new row after 4 country + the last country box get final class for animation
const classifyLastFinalBoxAndFixRow = (selectedCountries) => {
    let currentCountry = '';
    const selectedCountriesAfterClassify = [];
    for (let i = 0; i < selectedCountries.length; i++) {
        if (i === 0 || i % 4 !== 0) {
            if (i === selectedCountries.length - 1) {
                currentCountry += selectedCountries[i].replace('country_details_box', 'country_details_box final');
            } else {
                currentCountry += selectedCountries[i];
            }
        } else {
            currentCountry = `<div class="row-full">${currentCountry}</div>`;
            selectedCountriesAfterClassify.push(currentCountry);
            if (i === selectedCountries.length - 1) {
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

// delete all countries from DOM - button listener
document.getElementById('delete_all_data').addEventListener('click', el => {
    el.preventDefault(); // prevent from page to reload
    document.querySelector('.country-boxes').innerHTML = '';
    selectedCountries = [];
});


document.getElementById('get_country').addEventListener('click', el => {
    const val = document.getElementById("myInput").value;
    const countryFromSearch = new Country(val);
    countryFromSearch.getCountry().then(value => {
        renderView(countryFromSearch);
    });
});


// Main //
let countries = [];
let selectedCountries = [];
getAllCountriesNames().then(value => {
    countries = value;
    autocomplete(document.getElementById("myInput"), countries);
}).catch(reason => {
    document.getElementById('myInput').placeholder = 'Unable load countries';
});



