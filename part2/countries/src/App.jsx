import { useState, useEffect } from 'react'
import axios from 'axios'
import Country from './components/Country'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelected(null)
  }

  const matches = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const showResults = () => {
    if (selected) {
      return <Country country={selected} />
    }
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
      <div key={country.cca3}>
        {country.name.common} <button onClick={() => setSelected(country)}>show</button>
      </div>
    ))
  }

  return (
    <div>
      find countries <input value={search} onChange={handleSearchChange} />
      {showResults()}
    </div>
  )
}

export default App
