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

const searchValue = refs.inputSearchBoxEl.value;

// console.dir(searchValue);
// console.dir(refs.countryListEl);
// console.log(refs.countryInfoListEl);

refs.inputSearchBoxEl.addEventListener('input', onInputValue);

function onInputValue(searchValue) {
  e.preventDefault();
}

// function onCreateCountryList(params) {}

// function onCreateCountryInfoList(params) {}
