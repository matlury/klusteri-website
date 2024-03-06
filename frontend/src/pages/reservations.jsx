import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../index.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
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

  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end });
    setEventDetails({
      ...eventDetails,
      start,
      end,
    });
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
      setSelectedSlot(null);
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

  return (
    <div className="textbox">
      <h1>Varauskalenteri</h1>
      <div>
        {selectedSlot && (
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
              <option value="avoin">Avoin</option>
              <option value="suljettu">Suljettu</option>
            </select>
            <select name="room" value={eventDetails.room} onChange={handleInputChange}>
              <option value="">Valitse huone</option>
              <option value="Huone 1">Kokoushuone</option>
              <option value="Huone 2">Kerhotila</option>
              <option value="Huone 3">Oleskelutila</option>
            </select>
            <button onClick={handleAddEvent}>Lisää tapahtuma</button>
          </div>
        )}
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
      />
    </div>
  );
};

const Reservations = () => {
  return <MyCalendar />;
};

export default Reservations;
