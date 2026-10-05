const Country = ({ country }) => (
  <div>
    <h1>{country.name.common}</h1>
    <div>Capital {country.capital?.join(', ')}</div>
    <div>Area {country.area}</div>

    <h2>Languages</h2>
    <ul>
      {Object.values(country.languages ?? {}).map(language => (
        <li key={language}>{language}</li>
      ))}
    </ul>
    <img src={country.flags.png} alt={country.flags.alt} width="200" />
  </div>
)

export default Country
