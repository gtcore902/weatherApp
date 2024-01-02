import API_KEY from './apiKey.js'
let mainWeatherContainer = document.querySelector('.main-weather');
let locationForm = document.getElementById("locationForm");
let submitBtn = document.getElementById('submitBtn')
let inputTextBtn = document.getElementById('inputTextBtn')
let weatherIcon = document.querySelector('.current-weather-icon')
let currentWeatherTemp = document.querySelector('.current-weather-temp')
let currentWeatherSky = document.querySelector('.current-weather-sky')
let currentWeatherWind = document.querySelector('.current-weather-wind')
let currentWeatherHumidity = document.querySelector('.current-weather-humidity')
let currentWeatherFeels = document.querySelector('.current-weather-feels')
let errorText = document.querySelector('.error-text')
let localStorageLocation = localStorage.getItem('location')
let userLocation;
let weatherConditionsConverter = {
    'clearsky': 'Dégagé',
    'fewclouds': 'Quelques nuages',
    'scatteredclouds': 'nuages ​​dispersés',
    'overcastclouds': 'Couvert',
    'brokenclouds': 'Peu nuageux',
    'showerrain': 'Fortes pluies',
    'rain': 'Pluie',
    'thunderstorm': 'Orages',
    'snow': 'Neige',
    'lightsnow': 'Neige légère',
    'mist': 'Brouillard',
}

/**
 * Set storage system
 */
async function setStorageSystem() {
    if (localStorageLocation !== null) {
        console.log('fuck')
        await removeErrorImg()
        .then(getWeatherDatas(localStorageLocation))
            .then(inputTextBtn.value = localStorageLocation)
    } else if (localStorageLocation === null) {
        console.log(':((')
        let errorImg = document.createElement('img')
        errorImg.src = 'images/undraw_happy_music_g6wc.svg'
        errorImg.classList.add('feeling-blue')
        currentWeatherTemp.appendChild(errorImg)
        
    }
}
/**
 * Remoce error image if exists
 */
async function removeErrorImg() {
    if (document.querySelector('.feeling-blue')) {
        document.querySelector('.feeling-blue').remove()
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
  * Set behavior of input type text button on focus
  */
//  inputTextBtn.addEventListener('click', () => {
//     console.log('focus')
//     inputTextBtn.value = ""
//  })
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
            // getLocationName(userLocation)
            getWeatherDatas(userLocation)
                .then(submitBtn.style.visibility = 'hidden')
        } else {
            errorText.textContent = "Please enter valide location"
        }
    });
  }

/**
 * Get location name from API
 * @param {string} userLocation 
 */
// async function getLocationName(userLocation) {
//     try {
//         const response = await fetch(
//         `http://api.openweathermap.org/geo/1.0/direct?q=${userLocation}&limit=5&appid=${API_KEY}`
//         );
//         if (!response.ok) {
//         throw new Error(response.status);
//         // console.log(response.status);
//         }
//         const datas = await response.json();
//     } catch (error) {
//         console.error("Error code: ", error);
//     }
// }
/**
 * function to convert current weather sky
 */
function convertCurrentWeatherSky(englishCurrentWeatherSky) {
    // console.log(englishCurrentWeatherSky)
    if (englishCurrentWeatherSky.match(' ')) {
        let concatEnglishCurrentWeatherSky = englishCurrentWeatherSky.replace(' ','')
        let conditionsTranslated = weatherConditionsConverter[concatEnglishCurrentWeatherSky]
        return conditionsTranslated
    }
    return weatherConditionsConverter[englishCurrentWeatherSky]
}

/**
 * Convert farenheit temperatures to celsius
 * @param {number} farenheitTemperature 
 * @returns number
 */
function convertFarenheitTemperature(farenheitTemperature) {
    return Math.round((Math.floor(farenheitTemperature) - 273.15).toFixed(2))
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
        let converter = convertFarenheitTemperature(datas.main.temp)
        weatherIcon.src = `https://openweathermap.org/img/wn/${datas.weather[0].icon}@2x.png`;
        weatherIcon.alt = `Icon ${datas.weather[0].description}`
        currentWeatherTemp.innerHTML = `${converter}°`;
        currentWeatherSky.innerHTML = convertCurrentWeatherSky(datas.weather[0].description);
        currentWeatherWind.innerHTML = `${(Math.round(datas.wind.speed*3.6))} km/h <span>Vent</span>`
        currentWeatherHumidity.innerHTML = `${datas.main.humidity}% <span>Humidité</span>`
        currentWeatherFeels.innerHTML = `${convertFarenheitTemperature(datas.main.feels_like)}° <span>Ressenties</span>`
    } catch (error) {
        console.error(error);
    }
}

/**
 * Launch weather system
 */
showSubmitButton()
getUserlocation()
setStorageSystem()
  