import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY

const Weather = ({ capital, latlng }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (!latlng) {
      return
    }
    const [lat, lon] = latlng
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.log('could not get weather', error.message)
      })
  }, [latlng])

  if (!weather) {
    return null
  }

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <div>Temperature {weather.main.temp} Celsius</div>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <div>Wind {weather.wind.speed} m/s</div>
    </div>
  )
}

export default Weather
