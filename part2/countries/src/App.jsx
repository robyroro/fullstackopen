import { useState, useEffect } from 'react'
import axios from 'axios'
import Country from './components/Country'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const matches = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const showResults = () => {
    if (search === '') {
      return null
    }
    if (matches.length > 10) {
      return <div>Too many matches, specify another filter</div>
    }
    if (matches.length === 1) {
      return <Country country={matches[0]} />
    }
    return matches.map(country => (
      <div key={country.cca3}>{country.name.common}</div>
    ))
  }

  return (
    <div>
      find countries <input value={search} onChange={(e) => setSearch(e.target.value)} />
      {showResults()}
    </div>
  )
}

export default App
