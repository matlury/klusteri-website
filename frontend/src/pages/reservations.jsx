import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import { useStateContext } from "../context/ContextProvider.jsx";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState({
    title: '',
    organizer: '',
    description: '',
    responsible: '',
    isOpen: 'avoin',
    room: '',
    start: '',
    end: '',
  });
  const [showModal, setShowModal] = useState(false);
  const { user } = useStateContext(); // Lisätty user-tila kirjautumistarkistusta varten

  const handleSelectSlot = ({ start, end }) => {
    if (user) {
      setSelectedSlot({ start, end });
      setEventDetails({
        ...eventDetails,
        start,
        end,
      });
      setShowModal(true);
    } else {
      alert('Sinun täytyy kirjautua sisään lisätäksesi tapahtuman.');
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };

  const handleAddEvent = () => {
    const { title, organizer, description, responsible, isOpen, room, start, end } = eventDetails;
    if (title && organizer && description && responsible && (isOpen === 'avoin' || isOpen === 'suljettu') && room) {
      const newEvent = {
        start,
        end,
        title,
        organizer,
        description,
        responsible,
        isOpen,
        room,
      };
      setEvents([...events, newEvent]);
      setShowModal(false);
      setEventDetails({
        title: '',
        organizer: '',
        description: '',
        responsible: '',
        isOpen: 'avoin',
        room: '',
        start: '',
        end: '',
      });
    } else {
      alert('Täytä kaikki tiedot ennen tapahtuman lisäämistä.');
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
              <p>Alkaa: <input type="datetime-local" name="start" value={eventDetails.start} onChange={handleInputChange} /></p>
              <p>Päättyy: <input type="datetime-local" name="end" value={eventDetails.end} onChange={handleInputChange} /></p>
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
                <option value="avoin">Avoin tapahtuma</option>
                <option value="suljettu">Vain jäsenille</option>
              </select>
              <select name="room" value={eventDetails.room} onChange={handleInputChange}>
                <option value="Kokoushuone">Kokoushuone</option>
                <option value="Kerhotila">Kerhotila</option>
                <option value="Oleskelutila">Oleskelutila</option>
                <option value="ChristinaRegina">ChristinaRegina</option>
              </select>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
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
