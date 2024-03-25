import React, { useState, useEffect, useRef } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fi';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import { useStateContext } from "../context/ContextProvider.jsx";
import axios from 'axios'; 

const API_URL = process.env.API_URL

moment.updateLocale('fi', {
  week: {
    dow: 1, 
  },
});

const localizer = momentLocalizer(moment);

moment.locale('fi');

const MyCalendar = () => {
  const [events, setEvents] = useState(() => {
    const storedEvents = localStorage.getItem('events');
    return storedEvents ? JSON.parse(storedEvents) : [];
  });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
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
  });
  
  const [showModal, setShowModal] = useState(false);
  const { user } = useStateContext(); 

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const startRef = useRef(null);
  const endRef = useRef(null);

  const handleSelectSlot = ({ start, end }) => {
    if (user) {
      setSelectedSlot({ start, end });
      setShowModal(true);
    } else {
      alert('Sinun täytyy kirjautua sisään lisätäksesi tapahtuman.');
    }
  };

  useEffect(() => {
    if (showModal && selectedSlot) {
      startRef.current.value = moment(selectedSlot.start).format('YYYY-MM-DDTHH:mm');
      endRef.current.value = moment(selectedSlot.end).format('YYYY-MM-DDTHH:mm');
    }
  }, [showModal, selectedSlot]);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };

  const handleAddEvent = () => {
    const { title, organizer, description, responsible, isOpen, room, start, end, id } = eventDetails;
    if (title && organizer && description && responsible && (isOpen === 'avoin' || isOpen === 'suljettu') && room && start && end && id) {
      
      const isRoomOccupied = events.some(event => {
        return event.room === room && (
          (moment(start).isSameOrAfter(event.start) && moment(start).isBefore(event.end)) ||
          (moment(end).isSameOrAfter(event.start) && moment(end).isBefore(event.end)) ||
          (moment(start).isBefore(event.start) && moment(end).isSameOrAfter(event.end))
        );
      });

      if (isRoomOccupied) {
        alert('Huone on jo varattu valitulle ajankohdalle.');
        return;
      }

      const newEvent = {
        start,
        end,
        title,
        organizer,
        description,
        responsible,
        isOpen,
        room,
        id,
      };

      axios.post(`${API_URL}/api/listobjects/events/`, newEvent)
        .then(response => {
          console.log('Tapahtuma tallennettu:', response.data);
          newEvent.id = response.data.id;
        })
        .catch(error => {
          console.error('Virhe tapahtuman tallentamisessa:', error);
        });

      setEvents([...events, newEvent]);
      setShowModal(false);
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
      });
    } else {
      alert('Täytä kaikki tiedot ennen tapahtuman lisäämistä.');
    }
  };

  const handleDeleteEvent = (eventId) => {
    console.log(selectedEvent)
    if (eventId) {
      axios.delete(`${API_URL}/api/events/delete_event/${eventId}/`)
        .then(response => {
          console.log('Tapahtuma poistettu:', response.data);
          setEvents(events.filter(event => event.id !== eventId));
        })
        .catch(error => {
          console.error('Virhe tapahtuman poistamisessa:', error);
        });
    } else {
    
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="textbox">
      <h1>Varauskalenteri</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        firstDay={1}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.isOpen === 'avoin' ? '#4caf50' : '#F08080', 
            borderRadius: '5px',
            border: 'none',
            color: '#fff',
            padding: '5px',
            margin: '0 3px',
            cursor: 'pointer',
          },
        })}
      />
      
      
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent ? selectedEvent.title : 'Lisää tapahtuma'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <>
              <p>Alkaa: {moment(selectedEvent.start).format('YYYY-MM-DD HH:mm')}</p>
              <p>Päättyy: {moment(selectedEvent.end).format('YYYY-MM-DD HH:mm')}</p>
              <p>Järjestäjä: {selectedEvent.organizer}</p>
              <p>Vastuuhenkilö: {selectedEvent.responsible}</p>
              <p>Kuvaus: {selectedEvent.description}</p>
              <p>Tila: {selectedEvent.isOpen}</p>
              <p>Huone: {selectedEvent.room}</p>
            </>
          )}
          {!selectedEvent && (
            <div>
              <p>Valitun ajanjakson tiedot:</p>
              <p>Alkaa: <input type="datetime-local" name="start" ref={startRef} onChange={handleInputChange} /></p>
              <p>Päättyy: <input type="datetime-local" name="end" ref={endRef} onChange={handleInputChange} /></p>
              <input
                type="text"
                name="title"
                placeholder="Tapahtuman nimi"
                value={eventDetails.title}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="organizer"
                placeholder="Järjestäjä"
                value={eventDetails.organizer}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="responsible"
                placeholder="Vastuuhenkilö"
                value={eventDetails.responsible}
                onChange={handleInputChange}
                />
                <textarea
                  name="description"
                  placeholder="Tapahtuman kuvaus"
                  value={eventDetails.description}
                  onChange={handleInputChange}
                  style={{ width: '100%', height: '100px' }}
                />
                <select name="isOpen" value={eventDetails.isOpen} onChange={handleInputChange}>
                <option value="tyhjä">Valitse avoimuus</option>
                  <option value="avoin">Avoin tapahtuma</option>
                  <option value="suljettu">Vain jäsenille</option>
                </select>
                <select name="room" value={eventDetails.room} onChange={handleInputChange}>
                <option value="tyhjä">Valitse huone</option>
                  <option value="Kokoushuone">Kokoushuone</option>
                  <option value="Kerhotila">Kerhotila</option>
                  <option value="Oleskelutila">Oleskelutila</option>
                  <option value="ChristinaRegina">ChristinaRegina</option>
                </select>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {selectedEvent && (
              <Button variant="danger" onClick={() => handleDeleteEvent(selectedEvent.id)}>
                Poista tapahtuma
              </Button>
            )}
            <Button variant="secondary" onClick={handleCloseModal}>
              Sulje
            </Button>
            {!selectedEvent && (
              <Button variant="primary" onClick={handleAddEvent}>
                Tallenna
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    );
  };
  
  export default MyCalendar;
  
