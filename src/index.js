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
    refs.countryInfoListEl.innerHTML = onCreateCountryInfoList(result);
  }
  if (result.length > 1 && result.length < 11) {
    countryInfo.innerHTML = '';
    refs.countryListEl.innerHTML = onCreateCountryList(result);
  }
}

function onCreateCountryList(result) {
  return result
    .map(({ name, flags }) => {
      return `<li class="country-item">
                    <img src="${flags.svg}" alt="${name.official}" width="60" height="auto">
                    <span>${name.official}</span>
                </li>`;
    })
    .join('');
}

function onCreateCountryInfoList(result) {
  return result
    .map(({ flags, name, capital, population, languages }) => {
      languages = Object.values(languages).join(', ');
      return `<ul class="weather-info list">
                    <li class="weather-info-item-map">
                        <img src="${flags.svg}" alt="${name}" width="90" height="auto">
                        <p class="temp">${name.official}</p>
                    </li>
                    <li class="weather-info-item">
                        <p class="sunrise-time"><span class="bold">Capital:</span> ${capital}</p>
                    </li>
                    <li class="weather-info-item">
                        <p class="sunset-time"><span class="bold">Population:</span> ${population}</p>
                    </li>
                    <li class="weather-info-item">
                        <p class="clouds"><span class="bold">Languages:</span> ${languages}</p>
                    </li>
                </ul>`;
    })
    .join('');
}
