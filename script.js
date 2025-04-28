const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')
const currentTimeTxt = document.querySelector('.current-time-txt')
const forecastItemsContainer = document.querySelector('.forecast-items-container')
const weatherInfoSection = document.querySelector('.weather-info')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')

const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

const apiKey = '64aff95fea33adb056017a0dd1116b5a'
const defaultCity = 'Caloocan'

document.addEventListener('DOMContentLoaded', () => {
    updateWeatherInfo(defaultCity)
})

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim()
    if (city) {
        updateWeatherInfo(city)
    }
})

cityInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim()
        if (city) {
            updateWeatherInfo(city)
        }
    }
})

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    const response = await fetch(apiUrl)
    return response.json()
}

function getCurrentDate() {
    const currentDate = new Date()
    const options = { weekday: 'short', day: '2-digit', month: 'short' }
    return currentDate.toLocaleDateString('en-GB', options)
}

function getCurrentTime() {
    const now = new Date()
    const options = { hour: '2-digit', minute: '2-digit', hour12: true }
    return now.toLocaleTimeString('en-US', options)
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)
    const forecastsData = await getFetchData('forecast', city)

    if (weatherData.cod != 200 || forecastsData.cod != "200") {
        showDisplaySection(notFoundSection)
        return
    }

    // Set location and current date/time
    countryTxt.textContent = weatherData.name
    currentDateTxt.textContent = getCurrentDate()
    currentTimeTxt.textContent = getCurrentTime()

    // Find the nearest forecast time from now
    const now = new Date()
    const nearestForecast = forecastsData.list.find(forecast => {
        const forecastTime = new Date(forecast.dt_txt)
        return forecastTime > now
    })

    if (nearestForecast) {
        tempTxt.textContent = `${Math.round(nearestForecast.main.temp)} °C`
        conditionTxt.textContent = nearestForecast.weather[0].main
        weatherSummaryImg.src = `https://openweathermap.org/img/wn/${nearestForecast.weather[0].icon}@2x.png`
        humidityValueTxt.textContent = `${nearestForecast.main.humidity}%`
        windValueTxt.textContent = `${nearestForecast.wind.speed} M/s`
    } else {
        // fallback if forecast is missing
        tempTxt.textContent = `${Math.round(weatherData.main.temp)} °C`
        conditionTxt.textContent = weatherData.weather[0].main
        weatherSummaryImg.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
        humidityValueTxt.textContent = `${weatherData.main.humidity}%`
        windValueTxt.textContent = `${weatherData.wind.speed} M/s`
    }

    await updateForecastsInfo(forecastsData)
    changeThemeBasedOnTime()
    showDisplaySection(weatherInfoSection)
}

async function updateForecastsInfo(forecastsData) {
    forecastItemsContainer.innerHTML = ''

    const now = new Date()

    // Only show forecasts in the future
    const upcomingForecasts = forecastsData.list.filter(forecast => {
        const forecastTime = new Date(forecast.dt_txt)
        return forecastTime > now
    }).slice(0, 8) // Limit to 8 upcoming forecasts

    upcomingForecasts.forEach(weatherData => {
        const {
            dt_txt: dateTime,
            weather: [{ icon }],
            main: { temp }
        } = weatherData

        const time = new Date(dateTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })

        const forecastItem = `
            <div class="forecast-item">
                <h5 class="forecast-item-date regular-txt">${time}</h5>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" class="forecast-item-img">
                <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
            </div>
        `
        forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
    })
}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(sec => sec.style.display = 'none')
    section.style.display = 'flex'
}

function changeThemeBasedOnTime() {
    const currentHour = new Date().getHours()
    if (currentHour >= 18 || currentHour < 6) {
        document.body.classList.add('night-theme')
    } else {
        document.body.classList.remove('night-theme')
    }
}
