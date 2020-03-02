export default class Country {
    constructor(name) {
        this.name = name;
    }

    async getCountry() {
        const data = await fetch(`https://restcountries.eu/rest/v2/name/${this.name}`);
        const dataJson = await data.json();
        this.region = dataJson[0].region;
        this.capital = dataJson[0].capital;
        this.code = dataJson[0].alpha3Code;
        this.flag = dataJson[0].flag
    }
}