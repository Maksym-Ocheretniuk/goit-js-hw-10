import './css/styles.css';

// Import as a Module
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import debounce from 'lodash.debounce';
import { fetchSearchCountries } from './js/fetchSearchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.getElementById('search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

// const searchValue = refs.inputEl.value;
// console.dir(searchValue);
// console.dir(refs.countryListEl);
// console.log(refs.countryInfoEl);

refs.inputEl.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(e) {
  e.preventDefault();

  const value = e.target.value.trim();
  console.log(value);

  if (!value) {
    clearInterface();
    return;
  }

  fetchSearchCountries(value)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        clearInterface();
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      renderCountries(data);
    })
    .catch(err => {
      clearInterface();
      if (err.message === '404') {
        Notify.failure('Oops, there is no country with that name');
      } else {
        Notify.failure(err.message);
      }
    });
}

function clearInterface() {
  refs.countryListEl.innerHTML = '';
  refs.countryInfoEl.innerHTML = '';
}

function renderCountries(result) {
  if (result.length === 1) {
    clearInterface();
    refs.countryInfoEl.insertAdjacentHTML(
      'afterbegin',
      onCreateCountryInfo(result)
    );
  }
  if (result.length > 1 && result.length <= 10) {
    clearInterface();
    refs.countryListEl.insertAdjacentHTML(
      'afterbegin',
      onCreateCountryList(result)
    );
  }
}

function onCreateCountryInfo(result) {
  return result
    .map(
      ({
        flags,
        name,
        capital,
        population,
        languages,
      }) => `<ul class="country-info__list">
        <li class="country-info__item-title">
          <img src="${flags.svg}" alt="${
        name.official
      }" width="80" height="auto">
          <p class="country-name">${name.official}</p>
        </li>
        <li class="country-info__item">
          <p><span class="bold">Capital: </span>${capital}</p>
        </li>
        <li class="country-info__item">
          <p><span class="bold">Population: </span>${population}
          </p >
        </li>
        <li class="country-info__item">
          <p><span class="bold">Languages: </span>${Object.values(
            languages
          )}</p>
        </li>
      </ul>
      `
    )
    .join('');
}

function onCreateCountryList(result) {
  return result
    .map(({ name, flags }) => {
      return `
        <li class="country-item">
          <img src="${flags.svg}" alt="${name.official}" width="60" height="auto">
          <span class="country-name">${name.official}</span>
        </li>
        `;
    })
    .join('');
}
