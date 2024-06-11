import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import {
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { CSVLink } from "react-csv";
import { getCurrentDateTime } from "../utils/timehelpers";
import DownloadIcon from '@mui/icons-material/Download';
import OrgSelect from "./OrganizationChooseBox";

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
  localizer,
  events,
  startRef,
  endRef,
  selectedEvent,
  handleDeleteEvent,
  moment,
  organizations,
}) => {
  const [CSVdata, setCSVdata] = useState(null);
  const [shouldDownload, setShouldDownload] = useState(false);

  let admin = false;
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  if (user) {
    if (user.role < 3) {
      admin = true;
    }
  }

  const handleCSV = async () => {
    if (events.length > 0) {
      const data = [
        [
          "START",
          "END",
          "ORGANIZER",
          "TITLE",
          "DESCRIPTION",
          "RESPONSIBLE",
          "ROOM",
          "OPEN",
        ],
      ];
      events.forEach((e) => {
        data.push([
          e.start,
          e.end,
          e.organizer.name,
          e.title,
          e.description,
          e.responsible,
          e.room,
          e.open,
        ]);
      });
      setCSVdata(data);
      setShouldDownload(true);
    }
  };

  const date = getCurrentDateTime();

  const CSVDownload = (props) => {
    const btnRef = useRef(null);
    useEffect(() => {
      if (btnRef.current) {
        btnRef.current.click();
        setShouldDownload(false);
      }
    }, [btnRef]);

    return (
      <CSVLink {...props}>
        <span ref={btnRef} />
      </CSVLink>
    );
  };

  return (
    <div className="textbox">
      {admin && (
        <div className="csv-download-button">
          <Button
            id="donwloadCSV"
            variant="contained"
            onClick={handleCSV}
            style={{
              padding: "7px",
              margin: "10px",
              float: "right",
            }}
            startIcon={<DownloadIcon />}
          >
            Lataa tapahtumat CSV-muodossa
          </Button>
          {shouldDownload && CSVdata && (
            <CSVDownload
              data={CSVdata}
              filename={`klusteri-events-${date}.csv`}
              target="_blank"
            />
          )}
        </div>
      )}
      <Typography variant="h1" component="h1">
        Varauskalenteri
      </Typography>
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

      <Dialog open={showCreateModal} onClose={handleCloseModal}>
        <DialogTitle>{"Lisää tapahtuma"}</DialogTitle>
        <DialogContent>
          <div>
            <Typography variant="body1">Varauksen tiedot:</Typography>
            <Typography variant="body2" color="textSecondary">
              Voit tehdä enimmillään 24 tunnin varauksen.
            </Typography>
            <TextField
              id="startTime"
              data-testid="startTime"
              label="Alkaa"
              type="datetime-local"
              name="start"
              value={startRef}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="endTime"
              data-testid="endTime"
              label="Päättyy"
              type="datetime-local"
              name="end"
              value={endRef}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Typography variant="body2" color="error">
              Huomioithan yökäyttösäännöt klo 00-08.
            </Typography>
            <TextField
              id="eventName"
              name="title"
              label="Tapahtuman nimi"
              value={eventDetails.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <OrgSelect
              data={organizations}
              value={eventDetails.organizer}
              handleChange={(event) =>
                handleInputChange({
                  target: {
                    name: "organizer",
                    value: event.target.value,
                  },
                })
              }
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
                <MenuItem value="Kokoushuone">Kokoushuone</MenuItem>
                <MenuItem value="Kerhotila">Kerhotila</MenuItem>
                <MenuItem value="Oleskelutila">Oleskelutila</MenuItem>
                <MenuItem value="ChristinaRegina">ChristinaRegina</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseModal}>
            Sulje
          </Button>
          <Button
            id="confirmCreate"
            variant="contained"
            onClick={handleAddEvent}
          >
            Tallenna
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showInfoModal} onClose={handleCloseModal}>
        <DialogTitle>{selectedEvent ? selectedEvent.title : ""}</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <>
              <Typography variant="body1">
                Alkaa: {moment(selectedEvent.start).format("YYYY-MM-DD HH:mm")}
              </Typography>
              <Typography variant="body1">
                Päättyy: {moment(selectedEvent.end).format("YYYY-MM-DD HH:mm")}
              </Typography>
              <Typography variant="body1">
                Järjestäjä: {selectedEvent.organizer.name}
              </Typography>
              <Typography variant="body1">
                Vastuuhenkilö: {selectedEvent.responsible}
              </Typography>
              <Typography variant="body1">
                Kuvaus: {selectedEvent.description}
              </Typography>
              <Typography variant="body1">
                Tila: {selectedEvent.open === true ? "Avoin" : "Suljettu"}
              </Typography>
              <Typography variant="body1">
                Huone: {selectedEvent.room}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            id="deleteEvent"
            variant="contained"
            color="error"
            onClick={() => handleDeleteEvent(selectedEvent.id)}
          >
            Poista tapahtuma
          </Button>
          <Button id="closeEvent" variant="outlined" onClick={handleCloseModal}>
            Sulje
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReservationsView;
