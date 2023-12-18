import API_KEY from './apiKey.js'

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
 * Get user location entry from form
 */
async function getUserlocation() {
    let localisationForm = document.getElementById("localisationForm");
    localisationForm.addEventListener("submit", (event) => {
        event.preventDefault();
        let localisationEntry = document.getElementById("localisation");
        userLocation = localisationEntry.value;
        console.log(localisationEntry.value);
        getLocationName(userLocation)
            .then(getWeatherDatas(userLocation))
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
        let weatherIcon = document.createElement("img");
        let para = document.createElement("p");
        let converter = (Math.floor(datas.main.temp) - 273.15).toFixed(2);
        weatherIcon.src = `https://openweathermap.org/img/wn/${datas.weather[0].icon}@2x.png`;
        weatherIcon.alt = `Icon ${datas.weather[0].description}`
        para.innerHTML = `${datas.name}, ${datas.sys.country} <br> ${datas.weather[0].description} <br> ${converter} °C`;
        document.getElementById("datas").appendChild(weatherIcon);
        document.getElementById("datas").appendChild(para);
    } catch (error) {
        console.error(error);
    }
}

/**
 * Launch system weather
 */
getUserlocation();
  