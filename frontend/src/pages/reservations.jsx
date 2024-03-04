import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../index.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt('Syötä tapahtuman nimi:');
    const organizer = window.prompt('Syötä järjestäjä:');
    const isOpen = window.confirm('Onko varaus avoin vai suljettu?');
    if (title && organizer !== null) {
      const newEvent = {
        start,
        end,
        title,
        organizer,
        isOpen,
      };
      setEvents([...events, newEvent]);
    }
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
      />
    </div>
  );
};

const Reservations = () => {
  return <MyCalendar />;
};

export default Reservations;