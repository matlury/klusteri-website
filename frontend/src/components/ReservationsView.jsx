import React from "react";
import { Modal } from "react-bootstrap";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Select, InputLabel, FormControl } from "@mui/material";

const ReservationsView = ({
  handleAddNewEventClick,
  handleSelectSlot,
  handleSelectEvent,
  showCreateModal,
  handleCloseModal,
  handleInputChange,
  eventDetails,
  handleAddEvent,
  showInfoModal,
  activeResponsibilities,
  localizer,
  events,
  startRef,
  endRef,
  selectedEvent,
  handleDeleteEvent,
  moment,
}) => {
  return (
    <div className="textbox">
      <h1>Varauskalenteri</h1>
      <div className="add-event-button">
        <Button
          id="createEvent"
          variant="contained"
          onClick={handleAddNewEventClick}
          style={{
            padding: "7px",
            margin: "10px",
          }}
        >
          Lisää uusi tapahtuma
        </Button>
      </div>
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
            backgroundColor: event.open === true ? "#4caf50" : "#F08080",
            borderRadius: "5px",
            border: "none",
            color: "#fff",
            padding: "5px",
            margin: "0 3px",
            cursor: "pointer",
          },
        })}
      />

      <Modal show={showCreateModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{"Lisää tapahtuma"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>Varauksen tiedot:</p>
            <p style={{ color: "grey" }}>
              Voit tehdä enimmillään 24 tunnin varauksen.
            </p>
            <TextField
              id="startTime"
              label="Alkaa"
              type="datetime-local"
              name="start"
              inputRef={startRef}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="endTime"
              label="Päättyy"
              type="datetime-local"
              name="end"
              inputRef={endRef}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <p style={{ color: "red" }}>
              Huomioithan yökäyttösäännöt klo 00-08.
            </p>
            <TextField
              id="eventName"
              name="title"
              label="Tapahtuman nimi"
              value={eventDetails.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              id="organizerName"
              name="organizer"
              label="Järjestäjä"
              value={eventDetails.organizer}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              id="responsibleName"
              name="responsible"
              label="Vastuuhenkilö"
              value={eventDetails.responsible}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              id="eventDescription"
              name="description"
              label="Tapahtuman kuvaus"
              value={eventDetails.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="eventOpen-label">Avoimuus</InputLabel>
              <Select
                labelId="eventOpen-label"
                id="eventOpen"
                name="isOpen"
                value={eventDetails.isOpen}
                onChange={handleInputChange}
                label="Avoimuus"
              >
                <MenuItem value="tyhjä">Valitse avoimuus</MenuItem>
                <MenuItem value="avoin">Avoin tapahtuma</MenuItem>
                <MenuItem value="suljettu">Vain jäsenille</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="eventRoom-label">Huone</InputLabel>
              <Select
                labelId="eventRoom-label"
                id="eventRoom"
                name="room"
                value={eventDetails.room}
                onChange={handleInputChange}
                label="Huone"
              >
                <MenuItem value="tyhjä">Valitse huone</MenuItem>
                <MenuItem value="Kokoushuone">Kokoushuone</MenuItem>
                <MenuItem value="Kerhotila">Kerhotila</MenuItem>
                <MenuItem value="Oleskelutila">Oleskelutila</MenuItem>
                <MenuItem value="ChristinaRegina">ChristinaRegina</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outlined" onClick={handleCloseModal}>
            Sulje
          </Button>
          <Button id="confirmCreate" variant="contained" onClick={handleAddEvent}>
            Tallenna
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showInfoModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent ? selectedEvent.title : ""}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <>
              <p>
                Alkaa: {moment(selectedEvent.start).format("YYYY-MM-DD HH:mm")}
              </p>
              <p>
                Päättyy: {moment(selectedEvent.end).format("YYYY-MM-DD HH:mm")}
              </p>
              <p>Järjestäjä: {selectedEvent.organizer}</p>
              <p>Vastuuhenkilö: {selectedEvent.responsible}</p>
              <p>Kuvaus: {selectedEvent.description}</p>
              <p>Tila: {selectedEvent.open === true ? "Avoin" : "Suljettu"}</p>
              <p>Huone: {selectedEvent.room}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            id="deleteEvent"
            variant="contained"
            color="error"
            onClick={() => handleDeleteEvent(selectedEvent.id)}
          >
            Poista tapahtuma
          </Button>
          <Button
            id="closeEvent"
            variant="outlined"
            onClick={handleCloseModal}
          >
            Sulje
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReservationsView;
