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
let lat, lon
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
    0: 'Lun',
    1: 'Mar',
    2: 'Mer',
    3: 'Jeu',
    4: 'Ven',
    5: 'Sam',
    6: 'Dim'
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
 * Get user location entry from form and launch fetch datas
 */
async function launchSystem() {
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
                    // .then(getForecastWeatherDatas(lat, lon, API_KEY))
        } else {
            errorText.textContent = "Please enter valide location"
        }
    });
  }
/**
 * function to convert current weather sky
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
    return Math.round((Math.floor(KelvinTemperature) - 273.15).toFixed(2))
}

/**
 * Get forcast weather datas from api
 */
async function getForecastWeatherDatas(lat, lon, apiKey) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        if (response.status === 404 || response.status === 400) {
            throw new Error("Error: La ville n'a pas été trouvé");
        }
        if (!response.ok) {
            throw new Error(response.status);
        }
        const datas = await response.json()
        console.log(datas)
        console.log(datas.list[8].dt_txt)
        let date = new Date(datas.list[8].dt_txt)
        console.log(date.getDay()) // day number
        console.log(datas.list[8].main.temp, datas.list[8].weather[0].description)
        console.log(datas.list[16].main.temp)
        console.log(datas.list[24].main.temp)
        console.log(datas.list[32].main.temp)
        console.log(datas.list[39].main.temp)

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
    currentWeatherHumidity.innerHTML = `${humidity}% <span>Humidité</span>`
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
            throw new Error("Error: La ville n'a pas été trouvé");
        }
        if (!response.ok) {
            throw new Error(response.status);
        }
        const datas = await response.json();
        console.log(datas);
        console.log(datas.weather[0].description);
        console.log('lat : ' + datas.coord.lat, 'lon : ' + datas.coord.lon);
        let convertedCelsiusTemp = convertKelvinTemperature(datas.main.temp)
        weatherIcon.src = `https://openweathermap.org/img/wn/${datas.weather[0].icon}@2x.png`;
        weatherIcon.alt = `Icon ${datas.weather[0].description}`
        displayCurrentWeatherSky(datas.weather[0].description)
        displayCurrentWeatherTemp(convertedCelsiusTemp)
        displayCurrentWeatherHumidity(datas.main.humidity)
        displayCurrentWeatherWind(Math.round(datas.wind.speed*3.6))
        displayCurrentWeatherFeels(datas.main.feels_like)
        // Get forcast datas
        lat = datas.coord.lat // check if necessary if function below
        lon = datas.coord.lon // check if necessary if function below
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
  