import React, { useState, useEffect, useRef } from "react";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/fi";
import { useStateContext } from "../context/ContextProvider.jsx";
import axiosClient from "../axios.js";
import axios from "axios";
import ReservationsView from "../components/ReservationsView.jsx";

const API_URL = process.env.API_URL;

// Set locale to Finnish and specify the first day of the week
moment.updateLocale("fi", {
  week: {
    dow: 1,
  },
});

const localizer = momentLocalizer(moment);

moment.locale("fi");

// The main calendar component
const MyCalendar = () => {
  // State variables for event data and modals
  const [events, setEvents] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    organizer: "",
    description: "",
    responsible: "",
    isOpen: "",
    room: "",
    start: "",
    end: "",
    id: "",
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { user } = useStateContext();

  // Calls getEvents() to fetch events when starting the page
  useEffect(() => {
    getEvents();
  }, []);

  const startRef = useRef(null);
  const endRef = useRef(null);

  // Gets all created events from backend
  const getEvents = () => {
    axios
      .get(`${API_URL}/api/listobjects/events/`)
      .then((response) => {
        const events = response.data;
        setEvents(events);
      })
      .catch((error) => {
        console.error("Virhe tapahtumien hakemisessa:", error);
      });
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  const getOrganizations = () => {
    axios
      .get(`${API_URL}/api/listobjects/organizations/`)
      .then((response) => {
        const organizations = response.data;
        setOrganizations(organizations);
      })
      .catch((error) => {
        console.error("Virhe järjestöjen hakemisessa:", error);
      });
  };

  // Opens the create new event modal if user is logged in
  const handleSelectSlot = ({ start, end }) => {
    if (user) {
      setSelectedSlot({ start, end });
      setShowCreateModal(true);
    } else {
      alert("Sinun täytyy kirjautua sisään lisätäksesi tapahtuman.");
    }
  };

  // Sets an initial time slot based on the local time when creating a new event after clicking on a day slot in the calendar
  useEffect(() => {
    if (startRef.current.value != null && showCreateModal && selectedSlot) {
      startRef.current.value = moment(selectedSlot.start).format(
        "YYYY-MM-DDTHH:mm",
      );
      endRef.current.value = moment(selectedSlot.end).format(
        "YYYY-MM-DDTHH:mm",
      );
    }
  }, [showCreateModal, selectedSlot]);

  // Handles clicking on an event, shows its information
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowInfoModal(true);
  };

  // Handles input changes when creating an event
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };

  // Handles creating a new event
  const handleAddEvent = () => {
    const {
      title,
      organizer,
      description,
      responsible,
      isOpen,
      room,
      start,
      end,
      id,
    } = eventDetails;
    const startDate = moment(start);
    const endDate = moment(end);
    const duration = moment.duration(endDate.diff(startDate)).asHours();
    const open = isOpen === "avoin" ? true : false;

    if (duration > 24) {
      alert("Varauksen kesto ei voi olla yli 24 tuntia.");
      return;
    }
    if (
      title &&
      organizer &&
      description &&
      responsible &&
      (isOpen === "avoin" || isOpen === "suljettu") &&
      room &&
      start &&
      end
    ) {
      // Checks if the chosen room is occupied during the chosen time
      const isRoomOccupied = events.some((event) => {
        return (
          event.room === room &&
          ((moment(start).isSameOrAfter(event.start) &&
            moment(start).isBefore(event.end)) ||
            (moment(end).isSameOrAfter(event.start) &&
              moment(end).isBefore(event.end)) ||
            (moment(start).isBefore(event.start) &&
              moment(end).isSameOrAfter(event.end)))
        );
      });

      if (isRoomOccupied) {
        alert("Huone on jo varattu valitulle ajankohdalle.");
        return;
      }

      const newEvent = {
        start: new Date(start),
        end: new Date(end),
        title,
        organizer,
        description,
        responsible,
        open,
        room,
        id,
      };

      // Saves the event to the database through axiosClient and fetches the event id that is automatically created in the db
      axiosClient
        .post(`events/create_event`, newEvent)
        .then((response) => {
          console.log("Tapahtuma tallennettu:", response.data);
          const updatedEvent = { ...newEvent, id: response.data.id };
          setEvents([...events, updatedEvent]);
          setShowCreateModal(false);
          setEventDetails({
            title: "",
            organizer: "",
            description: "",
            responsible: "",
            isOpen: "",
            room: "",
            start: "",
            end: "",
            id: "",
          });
        })
        .catch((error) => {
          alert("Virhe tapahtuman tallentamisessa");
          console.error("Virhe tapahtuman tallentamisessa", error);
        });
    } else {
      alert("Täytä kaikki tiedot ennen tapahtuman lisäämistä.");
    }
  };

  // Handles deleting an event with the event id
  const handleDeleteEvent = (eventId) => {
    if (eventId) {
      axiosClient
        .delete(`events/delete_event/${eventId}/`)
        .then((response) => {
          console.log("Tapahtuma poistettu:", response.data);
          setEvents(events.filter((event) => event.id !== eventId));
        })
        .catch((error) => {
          console.error("Virhe tapahtuman poistamisessa:", error);
        });
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowInfoModal(false);
  };

  // Handles clicking the 'Lisää uusi tapahtuma' button and shows the create modal
  const handleAddNewEventClick = () => {
    setSelectedSlot(null);
    setShowCreateModal(true);
    setEventDetails({
      title: "",
      organizer: "",
      description: "",
      responsible: "",
      isOpen: "",
      room: "",
      start: "",
      end: "",
    });
  };

  // Renders the calendar view, event modals and possible night responsibilities
  return (
    <ReservationsView
      handleAddNewEventClick={handleAddNewEventClick}
      handleSelectSlot={handleSelectSlot}
      handleSelectEvent={handleSelectEvent}
      showCreateModal={showCreateModal}
      handleCloseModal={handleCloseModal}
      handleInputChange={handleInputChange}
      eventDetails={eventDetails}
      handleAddEvent={handleAddEvent}
      showInfoModal={showInfoModal}
      localizer={localizer}
      events={events}
      startRef={startRef}
      endRef={endRef}
      selectedEvent={selectedEvent}
      handleDeleteEvent={handleDeleteEvent}
      moment={moment}
      organizations={organizations}
    />
  );
};

export default MyCalendar;
