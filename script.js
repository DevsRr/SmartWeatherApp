
const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')
const forecastItemsContainer = document.querySelector('.forecast-items-container')
const weatherInfoSection = document.querySelector('.weather-info')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')

const apiKey = '64aff95fea33adb056017a0dd1116b5a'
const defaultCity = 'Caloocan'

document.addEventListener('DOMContentLoaded', () => {
    updateWeatherInfo(defaultCity)
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

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)

    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection)
        return
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ main, icon }],
        wind: { speed }
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = `${Math.round(temp)} °C`
    conditionTxt.textContent = main
    humidityValueTxt.textContent = `${humidity}%`
    windValueTxt.textContent = `${speed} M/s`
    currentDateTxt.textContent = getCurrentDate()
    weatherSummaryImg.src = `https://openweathermap.org/img/wn/${icon}@2x.png`

    await updateForecastsInfo(city)
    showDisplaySection(weatherInfoSection)
}

async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city)
    forecastItemsContainer.innerHTML = ''

    forecastsData.list.slice(0, 8).forEach(weatherData => {
        const {
            dt_txt: dateTime,
            weather: [{ icon }],
            main: { temp }
        } = weatherData

        const time = new Date(dateTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
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
