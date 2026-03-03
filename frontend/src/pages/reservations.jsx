import React, { useState, useEffect, useRef } from "react";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/fi";
import { useStateContext } from "@context/ContextProvider";
import { organizationsAPI, eventsAPI } from "../api/api.ts";
import ReservationsView from "../components/ReservationsView.jsx";
import { useTranslation, } from "react-i18next";
import { Snackbar, Alert } from "@mui/material";

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
  const { t } = useTranslation();
  // State variables for event data and modals
  const [events, setEvents] = useState([]);
  const [loadedRanges, setLoadedRanges] = useState([]); // Track ranges already fetched
  const [organizations, setOrganizations] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filtering state
  const allRooms = [
    { value: "Kokoushuone", label: t("Kokoushuone") },
    { value: "Kerhotila", label: t("Kerhotila") },
    { value: "Oleskelutila", label: t("Oleskelutila") },
    { value: "ChristinaRegina", label: t("ChristinaRegina") }
  ];
  const [selectedRooms, setSelectedRooms] = useState(allRooms);
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

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const handleSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // Calls getEvents() to fetch events when starting the page or view changes
  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    getEvents(viewDate);
  }, [viewDate]);

  const handleNavigate = (newDate) => {
    setViewDate(newDate);
  };

  const startRef = useRef({ value: "" });
  const endRef = useRef({ value: "" });

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (startRef.current) {
      setStartTime(startRef.current.value || "");
    }
  }, [startRef.current?.value]);

  useEffect(() => {
    if (endRef.current && typeof endRef.current.value !== 'undefined' && endRef.current.value !== "") {
      const date = new Date(endRef.current.value);
      date.setTime(date.getTime() - (date.getTimezoneOffset() * 60 * 1000) - (1000 * 60));
      setEndTime(date.toISOString().slice(0, 16));
    } else if (endRef.current) {
      setEndTime(endRef.current.value || "");
    }
  }, [endRef.current?.value]);

  // Gets events for the current view from backend
  const getEvents = (date, isPrefetch = false) => {
    const startRange = isPrefetch
      ? moment(date).subtract(1, 'months').startOf('month')
      : moment(date).startOf('month').subtract(7, 'days');

    const endRange = isPrefetch
      ? moment(date).add(1, 'months').endOf('month')
      : moment(date).endOf('month').add(7, 'days');

    // If prefetching, we only care if the WHOLE range is already loaded.
    // If not prefetching, we check if the requested month is already loaded.
    const isLoaded = loadedRanges.some(range =>
      startRange.isSameOrAfter(range.start) && endRange.isSameOrBefore(range.end)
    );

    if (isLoaded) return;

    eventsAPI
      .getEventsWithQuery({
        start: startRange.toISOString(),
        end: endRange.toISOString()
      })
      .then((response) => {
        const rawData = response.data;
        const newEventsList = rawData.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));

        setEvents(prevEvents => {
          const existingIds = new Set(prevEvents.map(e => e.id));
          const uniqueNewEvents = newEventsList.filter(e => !existingIds.has(e.id));
          return [...prevEvents, ...uniqueNewEvents];
        });

        setLoadedRanges(prev => [...prev, { start: startRange, end: endRange }]);

        // If we just finished loading the current month, now trigger the background prefetch
        if (!isPrefetch) {
          getEvents(date, true);
        }
      })
      .catch((error) => {
        console.error(t("errorfetchevents"), error);
      });
  };

  useEffect(() => {
    if (user) {
      getOrganizations();
    }
  }, [user]);

  const getOrganizations = () => {
    organizationsAPI
      .getOrganizations()
      .then((response) => {
        const organizations = response.data;
        setOrganizations(organizations);
      })
      .catch((error) => {
        console.error(t("errorfetchorg"), error);
      });
  };

  // Opens the create new event modal if user is logged in
  const handleSelectSlot = ({ start, end }) => {
    if (user) {
      setSelectedSlot({ start, end });
      setShowCreateModal(true);
    } else {
      handleSnackbar(t("erroreventlogin"), "info");
    }
  };

  // Sets an initial time slot based on the local time when creating a new event after clicking on a day slot in the calendar
  useEffect(() => {
    if (showCreateModal && selectedSlot) {
      if (!startRef.current || !endRef.current) {
        startRef.current = { value: "" };
        endRef.current = { value: "" };
      }
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
    if (name === "start") {
      setStartTime(value);
    } else if (name === "end") {
      setEndTime(value);
    }
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
      handleSnackbar(t("errorlongevent"), "warning");
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
        handleSnackbar(t("erroreventroom"), "error");
        return;
      }

      const newEvent = {
        start: new Date(start),
        end: new Date(end),
        title,
        organizer,
        description,
        responsible,
        created_by: user.id,
        open,
        room,
        id,
      };

      // Saves the event to the database through axiosClient and fetches the event id that is automatically created in the db
      eventsAPI
        .createEvent(newEvent)
        .then((response) => {
          const updatedEvent = { ...newEvent, id: response.data.id };
          setEvents([...events, updatedEvent]);
          setShowCreateModal(false);
          handleSnackbar(t("eventsuccess"), "success");
          setEventDetails({
            title: "",
            organizer: "",
            description: "",
            responsible: "",
            created_by: "",
            isOpen: "",
            room: "",
            start: "",
            end: "",
            id: "",
          });
        })
        .catch((error) => {
          handleSnackbar(t("errorevent"), "error");
          console.error(t("errorevent"), error);
        });
    } else {
      handleSnackbar(t("erroreventfields"), "warning");
    }
  };

  // Handles deleting an event with the event id
  const handleDeleteEvent = (eventId) => {
    if (eventId) {
      eventsAPI
        .deleteEvent(eventId)
        .then(() => {
          setEvents(events.filter((event) => event.id !== eventId));
        })
        .catch((error) => {
          console.error(t("erroreventdelete"), error);
        });
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowInfoModal(false);
  };

  // Handles clicking the 'Lisää uusi tapahtuma' button and shows the create modal
  const handleAddNewEventClick = () => {
    if (!user) {
      handleSnackbar(t("erroreventlogin"), "info");
      return;
    }
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
  const filteredEvents = events.filter(event =>
    selectedRooms.some(room => room.value === event.room)
  );

  return (
    <>
      <ReservationsView
        handleAddNewEventClick={handleAddNewEventClick}
        handleSelectSlot={handleSelectSlot}
        handleSelectEvent={handleSelectEvent}
        onNavigate={handleNavigate}
        showCreateModal={showCreateModal}
        handleCloseModal={handleCloseModal}
        handleInputChange={handleInputChange}
        eventDetails={eventDetails}
        handleAddEvent={handleAddEvent}
        showInfoModal={showInfoModal}
        localizer={localizer}
        events={filteredEvents}
        startRef={startTime}
        endRef={endTime}
        selectedEvent={selectedEvent}
        handleDeleteEvent={handleDeleteEvent}
        moment={moment}
        organizations={organizations}
        selectedRooms={selectedRooms}
        setSelectedRooms={setSelectedRooms}
        allRooms={allRooms}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        data-testid="snackbar"
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MyCalendar;