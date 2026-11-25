import { useState, useEffect, useRef } from 'react'
import personsService from './services/persons'
import Notification from './components/Notification'
import './index.css'

const Filter = ({searchQuery,onSearchChange}) => {
  return (
    <div>
        filter shown with: <input value ={searchQuery} onChange={onSearchChange}/>
    </div>
  )
}

const PersonForm = ({onSubmit, newName, onNameChange, newNumber, onNumberChange}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value ={newName} onChange={onNameChange} />
      </div>
      <div>
        number: <input value ={newNumber} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form> )
}

const Persons = ({personToShow,removePerson}) => {
  return (
    <div>
      {personToShow.map(person => (
        <div key={person.id}>{person.name} {person.number} {'  '}
        <button onClick={() => removePerson(person.id, person.name)}>delete</button>
        </div>))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [notification, setNotification] = useState(null)


  const notificationTimer = useRef(null)

  const notify = (message, type) => {
    clearTimeout(notificationTimer.current)
    setNotification({ message, type })
    notificationTimer.current = setTimeout(() => setNotification(null), 3000)
  }

  useEffect(() => {
    let active = true
    personsService.getAll()
      .then(initialPersons => {
        if (active) setPersons(initialPersons)
      })
      .catch(() => {
        if (active) notify('Failed to load contacts', 'error')
      })

    return () => {
      active = false
      clearTimeout(notificationTimer.current)
    }
  }, [])

  const addPerson = async (event) => {
    event.preventDefault()
    const name = newName.trim()
    const number = newNumber.trim()
    const existing = persons.find(person => person.name.toLowerCase() === name.toLowerCase())

    if (existing?.number === number) {
      alert(`${name} ${number} is already added to phonebook`)
      return
    }
    if (existing && !window.confirm(
      `${name} is already added to the phonebook, replace the old number with a new one?`
    )) return

    try {
      if (existing) {
        const updated = await personsService.update(existing.id, { name: existing.name, number })
        setPersons(current => current.map(person => person.id === updated.id ? updated : person))
        notify(`Updated '${updated.name}'`, 'success')
      } else {
        const created = await personsService.create({ name, number })
        setPersons(current => current.concat(created))
        notify(`Added '${created.name}'`, 'success')
      }
      setNewName('')
      setNewNumber('')
    } catch (error) {
      if (existing && error.response?.status === 404) {
        setPersons(current => current.filter(person => person.id !== existing.id))
        notify(`Information of '${existing.name}' has already been removed from the server`, 'error')
        return
      }
      const fallback = existing ? 'Failed to update contact' : 'Failed to add contact'
      notify(error.response?.data?.error || fallback, 'error')
    }
  }

  const toggleRemove = async (id, name) => {
    if (!window.confirm(`Remove ${name}?`)) return
    try {
      await personsService.remove(id)
      setPersons(current => current.filter(person => person.id !== id))
      notify('Deleted successfully', 'success')
    } catch {
      notify('Failed to delete contact', 'error')
    }
  }

  const personToShow = persons.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)}
  const handleNameChange = (event) => {
    setNewName(event.target.value)}
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)}

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification?.message} type={notification?.type}/>

      <Filter searchQuery={searchQuery} 
              onSearchChange={handleSearchChange}/>

      <h3>Add a new</h3>

      <PersonForm onSubmit={addPerson} 
                  newName={newName}
                  onNameChange={handleNameChange} 
                  newNumber={newNumber} 
                  onNumberChange={handleNumberChange}/>

      <h3>Numbers</h3>

      <Persons personToShow={personToShow} removePerson={toggleRemove}/>
      
    </div>
  )
}
export default App