const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')
const currentTimeTxt = document.querySelector('.current-time-txt')
const forecastItemsContainer = document.querySelector('.forecast-items-container')
const dailyForecastItemsContainer = document.querySelector('.daily-forecast-items-container')
const weatherInfoSection = document.querySelector('.weather-info')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')
const loader = document.querySelector('.loader')
const moreBtn = document.querySelector('.more-btn')
const moreMenu = document.querySelector('.more-menu')

const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')
const clearBtn = document.querySelector('.clear-btn')

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
  loader.style.display = 'block'
  const weatherData = await getFetchData('weather', city)
  const forecastsData = await getFetchData('forecast', city)
  loader.style.display = 'none'

  if (weatherData.cod != 200 || forecastsData.cod != '200') {
    showDisplaySection(notFoundSection)
    return
  }

  countryTxt.textContent = weatherData.name
  currentDateTxt.textContent = getCurrentDate()
  currentTimeTxt.textContent = getCurrentTime()
  tempTxt.textContent = `${Math.round(weatherData.main.temp)} °C`
  conditionTxt.textContent = weatherData.weather[0].main
  weatherSummaryImg.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
  humidityValueTxt.textContent = `${weatherData.main.humidity}%`
  windValueTxt.textContent = `${weatherData.wind.speed} M/s`

  await updateHourlyForecast(forecastsData)
  await updateDailyForecast(forecastsData)

  changeThemeBasedOnTime()
  showDisplaySection(weatherInfoSection)
}

async function updateHourlyForecast(forecastsData) {
  forecastItemsContainer.innerHTML = ''
  const now = new Date()

  const upcomingForecasts = forecastsData.list.filter(forecast => {
    return new Date(forecast.dt_txt) > now
  }).slice(0, 8)

  upcomingForecasts.forEach(forecast => {
    const time = new Date(forecast.dt_txt).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true
    })

    const forecastItem = `
      <div class="forecast-item">
        <h5 class="forecast-item-date regular-txt">${time}</h5>
        <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" class="forecast-item-img">
        <h5 class="forecast-item-temp">${Math.round(forecast.main.temp)} °C</h5>
      </div>
    `
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
  })
}

async function updateDailyForecast(forecastsData) {
  dailyForecastItemsContainer.innerHTML = ''
  const seenDates = new Set()

  forecastsData.list.forEach(forecast => {
    const date = forecast.dt_txt.split(' ')[0]
    if (!seenDates.has(date)) {
      seenDates.add(date)
      const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short' })

      const dailyItem = `
        <div class="forecast-item">
          <h5 class="forecast-item-date regular-txt">${day}</h5>
          <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" class="forecast-item-img">
          <h5 class="forecast-item-temp">${Math.round(forecast.main.temp)} °C</h5>
        </div>
      `
      dailyForecastItemsContainer.insertAdjacentHTML('beforeend', dailyItem)
    }
  })
}

function showDisplaySection(section) {
  [weatherInfoSection, searchCitySection, notFoundSection]
    .forEach(sec => sec.style.display = 'none')
  section.style.display = 'flex'
}

function changeThemeBasedOnTime() {
  const hour = new Date().getHours()
  if (hour >= 18 || hour < 6) {
    document.body.classList.add('night-theme')
    document.body.classList.remove('day-theme')
  } else {
    document.body.classList.add('day-theme')
    document.body.classList.remove('night-theme')
  }
}

moreBtn.addEventListener('click', () => {
  moreMenu.style.display = moreMenu.style.display === 'block' ? 'none' : 'block'
})

document.addEventListener('click', (e) => {
  if (!e.target.closest('.more-options')) {
    moreMenu.style.display = 'none'
  }
})
