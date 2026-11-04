import SearchForm from '../components/SearchForm'

export default function SearchPage() {
  function handleSearch(query) {
    console.log('search for', query)
  }
  return (
    <>
      <h2>Search</h2>
      <SearchForm onSearch={handleSearch} />
    </>
  )
}