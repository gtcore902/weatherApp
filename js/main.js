import API_KEY from './apiKey.js'
let locationForm = document.getElementById("locationForm");
let submitBtn = document.getElementById('submitBtn')
let inputTextBtn = document.getElementById('inputTextBtn')
let weatherIcon = document.querySelector('.current-weather-icon')
let weatherTemp = document.querySelector('.current-weather-temp')
let errorText = document.querySelector('.error-text')
let localStorageLocation = localStorage.getItem('location')
let userLocation;
let weatherConditionsConverter = {
    'clear sky': 'ondée',
    'few clouds': 'quelques nuages',
    'scattered clouds': 'nuages ​​dispersés',
    'broken clouds': '??',
    'shower rain': 'fortes pluies',
    'rain': 'pluie',
    'snow': 'neige',
    'mist': 'brouillard',
}
// console.log(weatherConditionsConverter['few clouds'])
// console.log(weatherConditionsConverter.rain)

/**
 * Set storage system
 */
function setStorageSystem() {
    if (localStorageLocation !== '') {
        console.log(localStorageLocation)
        getWeatherDatas(localStorageLocation)
            .then(inputTextBtn.value = localStorageLocation)
    } 
}


/**
 * Set visibility of submit button
 */
function showSubmitButton () {
    inputTextBtn.addEventListener('input', () => {
        submitBtn.style.visibility = 'visible';
    })
 }

 /**
  * 
  * @param {string} userLocation 
  * @returns true
  */
 function checkEntries(userLocation) {
    let regex = new RegExp('[a-zA-Z]')
    userLocation = userLocation.trim()
    if (regex.test(userLocation)) {
        return true
    }
 }
/**
 * Get user location entry from form
 */
async function getUserlocation() {
    locationForm.addEventListener("submit", (event) => {
        event.preventDefault();
        userLocation = inputTextBtn.value;
        console.log(inputTextBtn.value);
        // check entries
        if (checkEntries(userLocation)) {
            localStorage.setItem('location', userLocation)
            errorText.textContent = ""
            getLocationName(userLocation)
            .then(getWeatherDatas(userLocation))
                .then(submitBtn.style.visibility = 'hidden');
        } else {
            errorText.textContent = "Please enter valide location"
        }
    });
  }

/**
 * Get location name from API
 * @param {string} userLocation 
 */
async function getLocationName(userLocation) {
    try {
        const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${userLocation}&limit=5&appid=${API_KEY}`
        );
        if (!response.ok) {
        throw new Error(response.status);
        // console.log(response.status);
        }
        const datas = await response.json();
    } catch (error) {
        console.error("Error code: ", error);
    }
}

/**
 * Get datas from API located
 * @param {string} userLocation 
 */
async function getWeatherDatas(userLocation) {
    try {
        const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${userLocation}&appid=${API_KEY}`
        );
        if (response.status === 404 || response.status === 400) {
            throw new Error("Error: La ville n'a pas été trouvé");
        }
        if (!response.ok) {
            throw new Error(response.status);
        }
        const datas = await response.json();
        console.log(datas);
        console.log(datas.weather[0].description);
        let converter = (Math.floor(datas.main.temp) - 273.15).toFixed(2);
        converter = Math.round(converter)
        weatherIcon.src = `https://openweathermap.org/img/wn/${datas.weather[0].icon}@2x.png`;
        weatherIcon.alt = `Icon ${datas.weather[0].description}`
        // para.innerHTML = `${datas.name}, ${datas.sys.country} <br> ${datas.weather[0].description} <br> ${converter} °C`;
        weatherTemp.innerHTML = `${converter}°`;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Launch system weather
 */
showSubmitButton()
getUserlocation()
setStorageSystem()
  