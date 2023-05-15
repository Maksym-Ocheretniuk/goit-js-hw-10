import './css/styles.css';

// Import as a Module
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputSearchBoxEl: document.getElementById('search-box'),
  countryListEl: document.getElementsByClassName('country-list'),
  countryInfoListEl: document.getElementsByClassName('country-info'),
};

// const searchValue = refs.inputSearchBoxEl.value;

// console.dir(searchValue);
// console.dir(refs.countryListEl);
// console.log(refs.countryInfoListEl);

const BASE_URL = 'https://restcountries.com/v3.1/name/';
const searchParams = new URLSearchParams({
  fields: 'name,capital,population,flags,languages,',
});

refs.inputSearchBoxEl.addEventListener('input', onInputValue);

function onInputValue(e) {
  e.preventDefault();

  const value = e.target.value.trim();

  if (!value) {
    clearInterface();
    return;
  }

  const fetchCountries = countryName =>
    fetch(`${BASE_URL}${countryName}?${searchParams}`)
      .then(response => {
        if (response.status === 404) {
          throw new Error(response.status);
        }

        return response.json();
      })
      .then(data => {
        if (data.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
        renderCountries(data);
      })
      .catch(err => {
        clearInterface();
        Notify.failure('Oops, there is no country with that name');
      });
}

// function onCreateCountryList(params) {}

// function onCreateCountryInfoList(params) {}

function clearInterface() {
  countriesList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function renderCountries(result) {
  if (result.length === 1) {
    countriesList.innerHTML = '';
    // countryInfo.innerHTML = countryCardMarkup(result);
  }
  if (result.length > 1 && result.length < 11) {
    countryInfo.innerHTML = '';
    // countriesList.innerHTML = countriesListMarkup(result);
  }
}
