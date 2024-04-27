import React, { useState, useEffect, useRef } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/fi'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Modal, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../index.css'
import { useStateContext } from '../context/ContextProvider.jsx'
import axiosClient from '../axios.js'
import axios from 'axios'

const API_URL = process.env.API_URL

moment.updateLocale('fi', {
  week: {
    dow: 1, 
  },
})

const localizer = momentLocalizer(moment)

moment.locale('fi')

const MyCalendar = () => {
  const [events, setEvents] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventDetails, setEventDetails] = useState({
    title: '',
    organizer: '',
    description: '',
    responsible: '',
    isOpen: '',
    room: '',
    start: '',
    end: '',
    id: '',
  })
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const { user } = useStateContext()

  // Calls getEvents() to fetch events when starting the page
  useEffect(() => {
    getEvents()
  }, [])

  const startRef = useRef(null)
  const endRef = useRef(null)

  // Gets all created events from backend
  const getEvents = () => {
    axios
      .get(`${API_URL}/api/listobjects/events/`)
      .then(response => {
        const events = response.data
        setEvents(events)
      })
      .catch(error => {
        console.error('Virhe tapahtumien hakemisessa:', error)
      })
  }

  // Opens the create new event modal if user is logged in
  const handleSelectSlot = ({ start, end }) => {
    if (user) {
      setSelectedSlot({ start, end })
      setShowCreateModal(true)
    } else {
      alert('Sinun täytyy kirjautua sisään lisätäksesi tapahtuman.')
    }
  }

  // Sets an initial time slot based on the local time when creating a new event after clicking on a day slot in the calendar
  useEffect(() => {
    if (showCreateModal && selectedSlot) {
      startRef.current.value = moment(selectedSlot.start).format('YYYY-MM-DDTHH:mm')
      endRef.current.value = moment(selectedSlot.end).format('YYYY-MM-DDTHH:mm')
    }
  }, [showCreateModal, selectedSlot])

  // Handles clicking on an event, shows its information
  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    setShowInfoModal(true)
  }

  // Handles input changes when creating an event
  const handleInputChange = (event) => {
    const { name, value } = event.target
    setEventDetails({ ...eventDetails, [name]: value })
  }

  // Handles creating a new event
  const handleAddEvent = () => {
    const { title, organizer, description, responsible, isOpen, room, start, end, id } = eventDetails
    const startDate = moment(start)
    const endDate = moment(end)
    const duration = moment.duration(endDate.diff(startDate)).asHours()
    const open = isOpen === 'avoin' ? true : false

    if (duration > 24) {
      alert('Varauksen kesto ei voi olla yli 24 tuntia.')
      return
    }
    if (title && organizer && description && responsible && (isOpen === 'avoin' || isOpen === 'suljettu') && room && start && end) {
      
      // Checks if the chosen room is occupied during the chosen time
      const isRoomOccupied = events.some(event => {
        return event.room === room && (
          (moment(start).isSameOrAfter(event.start) && moment(start).isBefore(event.end)) ||
          (moment(end).isSameOrAfter(event.start) && moment(end).isBefore(event.end)) ||
          (moment(start).isBefore(event.start) && moment(end).isSameOrAfter(event.end))
        )
      })

      if (isRoomOccupied) {
        alert('Huone on jo varattu valitulle ajankohdalle.')
        return
      }

      const newEvent = {
        start,
        end,
        title,
        organizer,
        description,
        responsible,
        open,
        room,
        id,
      }

      // Saves the event to the database through axiosClient and fetches the event id that is automatically created in the db
      axiosClient.post(`events/create_event`, newEvent)
        .then(response => {
          console.log('Tapahtuma tallennettu:', response.data)
          const updatedEvent = { ...newEvent, id: response.data.id }
          setEvents([...events, updatedEvent])
          setShowCreateModal(false)
          setEventDetails({
            title: '',
            organizer: '',
            description: '',
            responsible: '',
            isOpen: '',
            room: '',
            start: '',
            end: '',
            id: '',
          })
        })
        .catch(error => {
          alert('Virhe tapahtuman tallentamisessa')
          console.error('Virhe tapahtuman tallentamisessa', error)
        })
    } else {
      alert('Täytä kaikki tiedot ennen tapahtuman lisäämistä.')
    }
  }

  // Handles deleting an event with the event id
  const handleDeleteEvent = (eventId) => {
    console.log(selectedEvent)
    if (eventId) {
      axiosClient.delete(`events/delete_event/${eventId}/`)
        .then(response => {
          console.log('Tapahtuma poistettu:', response.data)
          setEvents(events.filter(event => event.id !== eventId))
        })
        .catch(error => {
          console.error('Virhe tapahtuman poistamisessa:', error)
        })
    } else {
      console.log('ei id:tä')
    }
  }

  const handleCloseModal = () => {
    setShowCreateModal(false)
    setShowInfoModal(false)
  }

  // Handles clicking the 'Lisää uusi tapahtuma' button and shows the create modal
  const handleAddNewEventClick = () => {
    setSelectedSlot(null)
    setShowCreateModal(true)
    setEventDetails({  
      title: '',
      organizer: '',
      description: '',
      responsible: '',
      isOpen: '',
      room: '',
      start: '',
      end: '',
    })
  }

  const [allResponsibilities, setAllResponsibilities] = useState([])
  const [activeResponsibilities, setActiveResponsibilities] = useState([])

  // Gets current night responsibilities from the backend
  useEffect(() => {
    const fetchResponsibilities = async () => {
      try {
        const response = await axiosClient.get('listobjects/nightresponsibilities/')
        setAllResponsibilities(response.data)
        const active = response.data.filter(item => item.present === true)
        setActiveResponsibilities(active)
      } catch (error) {
        console.error('Error fetching responsibilities', error)
      }
    }

    fetchResponsibilities()
  }, [])

  function formatDatetime(datetimeString) {
    let date = new Date(datetimeString)
    
    let hours = String(date.getUTCHours()).padStart(2, '0')
    let minutes = String(date.getUTCMinutes()).padStart(2, '0')
    
    let day = String(date.getUTCDate()).padStart(2, '0')
    let month = String(date.getUTCMonth() + 1).padStart(2, '0')
    let year = String(date.getUTCFullYear())
    
    return `${hours}:${minutes} | ${day}.${month}.${year}`

  } 

  // Renders the calendar view, event modals and possible night responsibilities
  return (
    <div className='textbox'>
      <h1>Varauskalenteri</h1>
      <div className='add-event-button'>
      <Button variant='primary' onClick={handleAddNewEventClick} style={{ backgroundColor: 'gray', borderColor: 'gray', padding: '7px',  margin: '10px' }}
      >Lisää uusi tapahtuma</Button>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        firstDay={1}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.open === true ? '#4caf50' : '#F08080', 
            borderRadius: '5px',
            border: 'none',
            color: '#fff',
            padding: '5px',
            margin: '0 3px',
            cursor: 'pointer',
          },
        })}
      />
      
      <Modal show={showCreateModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{'Lisää tapahtuma'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
              <p>Varauksen tiedot:</p>
              <p style={{ color: 'grey' }}>Voit tehdä enimmillään 24 tunnin varauksen.</p>
              <p>Alkaa: <input type='datetime-local' name='start' ref={startRef} onChange={handleInputChange} /></p>
              <p>Päättyy: <input type='datetime-local' name='end' ref={endRef} onChange={handleInputChange} /></p>
              <p style={{ color: 'red' }}>Huomioithan yökäyttösäännöt klo 00-08.</p>
              <input
                name='title'
                placeholder='Tapahtuman nimi'
                value={eventDetails.title}
                onChange={handleInputChange}
                style={{ width: '100%', borderRadius: '5px'}}
              />
              <p></p>
              <input
                name='organizer'
                placeholder='Järjestäjä'
                value={eventDetails.organizer}
                onChange={handleInputChange}
                style={{ width: '100%', borderRadius: '5px'}}
              />
              <p></p>
              <input
                name='responsible'
                placeholder='Vastuuhenkilö'
                value={eventDetails.responsible}
                onChange={handleInputChange}

                style={{ width: '100%', borderRadius: '5px'}}
              />
              <p></p>

              <textarea
                name='description'
                placeholder='Tapahtuman kuvaus'
                value={eventDetails.description}
                onChange={handleInputChange}
                style={{ width: '100%', height: '100px', borderRadius: '5px'}}
              />
              <select name='isOpen' value={eventDetails.isOpen} onChange={handleInputChange}>
              <option value='tyhjä'>Valitse avoimuus</option>
                <option value='avoin'>Avoin tapahtuma</option>
                <option value='suljettu'>Vain jäsenille</option>
              </select>
              <select name='room' value={eventDetails.room} onChange={handleInputChange}>
              <option value='tyhjä'>Valitse huone</option>
                <option value='Kokoushuone'>Kokoushuone</option>
                <option value='Kerhotila'>Kerhotila</option>
                <option value='Oleskelutila'>Oleskelutila</option>
                <option value='ChristinaRegina'>ChristinaRegina</option>
              </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseModal}>
            Sulje
          </Button>
          <Button variant='primary' onClick={handleAddEvent}>
            Tallenna
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showInfoModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent ? selectedEvent.title : ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <>
              <p>Alkaa: {moment(selectedEvent.start).format('YYYY-MM-DD HH:mm')}</p>
              <p>Päättyy: {moment(selectedEvent.end).format('YYYY-MM-DD HH:mm')}</p>
              <p>Järjestäjä: {selectedEvent.organizer}</p>
              <p>Vastuuhenkilö: {selectedEvent.responsible}</p>
              <p>Kuvaus: {selectedEvent.description}</p>
              <p>Tila: {selectedEvent.open === true ? 'Avoin' : 'Suljettu'}</p>
              <p>Huone: {selectedEvent.room}</p>
            </>
          )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant='danger' onClick={() => handleDeleteEvent(selectedEvent.id)}>
              Poista tapahtuma
            </Button>
            <Button variant='secondary' onClick={handleCloseModal}>
              Sulje
            </Button>
          </Modal.Footer>
        </Modal>
        <div className='textbox_list_of_active_responsibilities'>
          <h4>Aktiiviset YKV-kirjaukset</h4>
          {activeResponsibilities.length > 0 ? (
            <div className='ykvtab'>
              <table className='ykvtable'>
                <thead>
                  <tr>
                    <th>Käyttäjänimi</th>
                    <th>Vastuualue</th>
                    <th>Kirjautumisaika</th>
                  </tr>
                </thead>
                <tbody>
                  {activeResponsibilities.map((responsibility, index) => (
                    <tr key={index}>
                      <td>{responsibility.username}</td>
                      <td>{responsibility.responsible_for}</td>
                      <td>{formatDatetime(responsibility.login_time)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Ei aktiivisia YKV-kirjauksia</p>
          )}
        </div>
      </div>
    )
  }
  
  export default MyCalendar
