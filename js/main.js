import API_KEY from './apiKey.js'
let mainWeatherContainer = document.querySelector('.main-weather');
let locationForm = document.getElementById("header__locationForm");
let submitBtn = document.getElementById('form-elements__submitBtn')
let inputTextBtn = document.getElementById('form-elements__inputTextBtn')
let weatherIcon = document.querySelector('.main-weather__datas-current-weather-icon')
let currentWeatherTemp = document.querySelector('.main-weather__datas-current-weather-temp')
let currentWeatherSky = document.querySelector('.main-weather__current-weather-sky')
let currentWeatherWind = document.querySelector('.details__current-weather-wind')
let currentWeatherHumidity = document.querySelector('.details__current-weather-humidity')
let currentWeatherFeels = document.querySelector('.details__current-weather-feels')
let errorText = document.querySelector('.form__error-text')
let localStorageLocation = localStorage.getItem('location')
let userLocation;
let currentDay = document.querySelector('.header__current-date')
let lat, lon
let nextDayContainer = document.querySelector('.next-days')
let forecastDayArrayContainersArray = [8, 16, 24, 32]
let forecastDayArrayContainers = document.querySelectorAll('.next-days__day')
forecastDayArrayContainers = Array.from(forecastDayArrayContainers)
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
let dayConverter = {
    0: 'Dimanche',
    1: 'Lundi',
    2: 'Mardi',
    3: 'Mercredi',
    4: 'Jeudi',
    5: 'Vendredi',
    6: 'Samedi',
}
let monthConverter = {
    0: 'janvier',
    1: 'février',
    2: 'mars',
    3: 'avril',
    4: 'mai',
    5: 'juin',
    6: 'juillet',
    7: 'août',
    8: 'septembre',
    9: 'octobre',
    10: 'novembre',
    11: 'décembre'
}

/**
 * Set storage system
 */
async function setStorageSystem() {
    if (localStorageLocation !== null) {
        await removeErrorImg()
        .then(getWeatherDatas(localStorageLocation))
        // .then(getForecastWeatherDatas(lat, lon, API_KEY))
            .then(inputTextBtn.value = localStorageLocation)
    } else if (localStorageLocation === null) {
        // errorText.textContent = "Please enter valide location"
        let errorImg = document.createElement('img')
        errorImg.src = 'images/undraw_happy_music_g6wc.svg'
        errorImg.classList.add('feeling-blue')
        currentWeatherTemp.appendChild(errorImg)
    }
}
/**
 * Remove error image if exists
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
  * Check if user location and remove spaces
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
 * Get user location entry from form and launch fetch datas
 */
async function launchSystem() {
    locationForm.addEventListener("submit", (event) => {
        event.preventDefault();
        userLocation = inputTextBtn.value;
        console.log(inputTextBtn.value);
        // Reset container for the following days
        nextDayContainer.innerHTML = ''
        // check entries
        if (checkEntries(userLocation)) {
            localStorage.setItem('location', userLocation)
            errorText.textContent = ""
            // getLocationName(userLocation)
            getWeatherDatas(userLocation)
                .then(submitBtn.style.visibility = 'hidden')
                    // .then(getForecastWeatherDatas(lat, lon, API_KEY))
        } else {
            errorText.textContent = "Please enter valide location"
        }
    });
  }
/**
 * function to convert current weather sky
 * @param {string} englishCurrentWeatherSky
 * @returns string
 */
function convertCurrentWeatherSky(englishCurrentWeatherSky) {
    if (englishCurrentWeatherSky.match(' ')) {
        let concatEnglishCurrentWeatherSky = englishCurrentWeatherSky.replace(' ','')
        let conditionsTranslated = weatherConditionsConverter[concatEnglishCurrentWeatherSky]
        return conditionsTranslated
    }
    return weatherConditionsConverter[englishCurrentWeatherSky]
}

/**
 * Convert Kelvin temperatures to celsius
 * @param {number} KelvinTemperature 
 * @returns number
 */
function convertKelvinTemperature(KelvinTemperature) {
    // return Math.round((Math.floor(KelvinTemperature) - 273.15).toFixed(2))
    return (Math.floor(KelvinTemperature - 273.15))
}
/**
 * Get and display the current date
 * @param {object} datas 
 */
function getCurrentDate(datas) {
    let today = new Date(datas * 1000)
    let day = dayConverter[today.getDay()]
    let dayNumber = today.getDate()
    let month = monthConverter[today.getMonth()]
    let year = today.getFullYear()
    currentDay.textContent = `${day} ${dayNumber} ${month} ${year}`
    // console.log(`${day} ${dayNumber} ${month} ${year}`)
}
/**
 * Get and display data for the following days
 * @param {object} datas 
 */
function getDisplayforecastDay(datas) {
    forecastDayArrayContainersArray.map((element) => {
        // Create container
        let dayContainer = document.createElement('div')
        dayContainer.classList.add('next-days__day')
        // Create element p for name of the day
        let dayContainerDay = document.createElement('p')
        // Create new date for thios element
        let nextDay = new Date(datas.list[element].dt_txt)
        let dayIndex = nextDay.getDay()
        dayContainerDay.textContent = dayConverter[dayIndex].charAt(0)+dayConverter[dayIndex].charAt(1)+dayConverter[dayIndex].charAt(2)
        // Create element img for weather icon
        let dayContainerWeatherImg = document.createElement('img') 
        dayContainerWeatherImg.src = `https://openweathermap.org/img/wn/${datas.list[element].weather[0].icon}@2x.png`
        // Create element p for temperature of the day
        let dayContainerTemp = document.createElement('p')
        dayContainerTemp.classList.add('temp-day')
        dayContainerTemp.textContent = convertKelvinTemperature(datas.list[element].main.temp) + '°'
        // Add elements to container
        dayContainer.appendChild(dayContainerDay)
        dayContainer.appendChild(dayContainerWeatherImg)
        dayContainer.appendChild(dayContainerTemp)
        // Add all to DOM
        nextDayContainer.appendChild(dayContainer)
    })
}
/**
 * Get forcast weather datas from api
 * @param {number} lat 
 * @param {number} lon 
 */
async function getForecastWeatherDatas(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        if (response.status === 404 || response.status === 400) {
            const returnErrorText = () => {
                errorText.textContent = "Please enter valide location"
                throw new Error("Error: La ville n'a pas été trouvé");
            }
        }
        if (!response.ok) {
            throw new Error(response.status);
        }
        const datas = await response.json()
        console.log(datas)
        // Get and display data for the following days
        getDisplayforecastDay(datas)
    } catch (error) {
        console.error(error);
    }
}
/**
 * Display current weather sky
 * @param {string} weatherSky 
 */
function displayCurrentWeatherSky(weatherSky) {
    currentWeatherSky.innerHTML = convertCurrentWeatherSky(weatherSky)
}
/**
 * Display current weather temperature
 * @param {number} temp 
 */
function displayCurrentWeatherTemp(temp) {
    currentWeatherTemp.innerHTML = `${temp}°`
}
/**
 * Display current weather swind
 * @param {number} wind 
 */
function displayCurrentWeatherWind(wind) {
    currentWeatherWind.innerHTML = `${wind} km/h <span>Vent</span>`
}
/**
 * Display current weather humidity
 * @param {number} humidity 
 */
function displayCurrentWeatherHumidity(humidity) {
    currentWeatherHumidity.innerHTML = `${humidity} % <span>Humidité</span>`
}
/**
 * Display current weather feels temperature
 * @param {number} feels 
 */
function displayCurrentWeatherFeels(feels) {
    currentWeatherFeels.innerHTML = `${convertKelvinTemperature(feels)} ° <span>Ressenties</span>`
}
/**
 * Get current weather datas from API located
 * @param {string} userLocation 
 */
async function getWeatherDatas(userLocation) {
    try {
        const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${userLocation}&appid=${API_KEY}`
        );
        if (response.status === 404 || response.status === 400) {
            const returnErrorText = () => {
                errorText.textContent = "Please enter valide location"
                throw new Error("Error: La ville n'a pas été trouvé");
            }
            returnErrorText()
        }
        if (!response.ok) {
            throw new Error(response.status);
        }
        const datas = await response.json();
        console.log(datas);
        // console.log(datas.dt)
        // Get and display current date
        getCurrentDate(datas.dt)
        let convertedCelsiusTemp = convertKelvinTemperature(datas.main.temp)
        weatherIcon.src = `https://openweathermap.org/img/wn/${datas.weather[0].icon}@2x.png`;
        weatherIcon.alt = `Icon ${datas.weather[0].description}`
        displayCurrentWeatherSky(datas.weather[0].description)
        displayCurrentWeatherTemp(convertedCelsiusTemp)
        displayCurrentWeatherHumidity(datas.main.humidity)
        displayCurrentWeatherWind(Math.round(datas.wind.speed*3.6))
        displayCurrentWeatherFeels(datas.main.feels_like)
        // Get forcast datas
        // lat = datas.coord.lat
        // lon = datas.coord.lon
        getForecastWeatherDatas(datas.coord.lat, datas.coord.lon, API_KEY)
    } catch (error) {
        console.error(error);
    }
}
/**
 * Launch weather system
 */
showSubmitButton()
launchSystem()
setStorageSystem()
  