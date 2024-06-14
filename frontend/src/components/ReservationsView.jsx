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
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

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
            {t("csvdownload")}
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
      <h2>{t("reservations_res")}</h2>
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
          {t("reservations_add")}
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
        <DialogTitle>{t("reservations_add")}</DialogTitle>
        <DialogContent>
          <div>
            <Typography variant="body1">{t("reservations_det")}</Typography>
            <Typography variant="body2" color="textSecondary">
              {t("reservations_info")}
            </Typography>
            <TextField
              id="startTime"
              data-testid="startTime"
              label={t("reservations_starts")}
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
              label={t("reservations_ends")}
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
              {t("reservations_noti")}
            </Typography>
            <TextField
              id="eventName"
              name="title"
              label={t("reservations_name")}
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
              label={t("reservations_resp")}
              value={eventDetails.responsible}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              id="eventDescription"
              name="description"
              label={t("reservations_desc")}
              value={eventDetails.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="eventOpen-label">{t("reservations_openness")}</InputLabel>
              <Select
                labelId="eventOpen-label"
                id="eventOpen"
                name="isOpen"
                value={eventDetails.isOpen}
                onChange={handleInputChange}
                label={t("reservations_openness")}
              >
                <MenuItem value="avoin">{t("reservations_open")}</MenuItem>
                <MenuItem value="suljettu">{t("reservations_closed")}</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="eventRoom-label">{t("reservations_room")}</InputLabel>
              <Select
                labelId="eventRoom-label"
                id="eventRoom"
                name="room"
                value={eventDetails.room}
                onChange={handleInputChange}
                label="Huone"
              >
                <MenuItem value="Kokoushuone">{t("Kokoushuone")}</MenuItem>
                <MenuItem value="Kerhotila">{t("Kerhotila")}</MenuItem>
                <MenuItem value="Oleskelutila">{t("Oleskelutila")}</MenuItem>
                <MenuItem value="ChristinaRegina">ChristinaRegina</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseModal}>
            {t("close")}
          </Button>
          <Button
            id="confirmCreate"
            variant="contained"
            onClick={handleAddEvent}
          >
            {t("save")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showInfoModal} onClose={handleCloseModal}>
        <DialogTitle>{selectedEvent ? selectedEvent.title : ""}</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <>
              <Typography variant="body1">
                {t("reservations_starts")}: {moment(selectedEvent.start).format("YYYY-MM-DD HH:mm")}
              </Typography>
              <Typography variant="body1">
                {t("reservations_ends")}: {moment(selectedEvent.end).format("YYYY-MM-DD HH:mm")}
              </Typography>
              <Typography variant="body1">
                {t("reservations_org")}: {selectedEvent.organizer.name}
              </Typography>
              <Typography variant="body1">
                {t("reservations_resp")}: {selectedEvent.responsible}
              </Typography>
              <Typography variant="body1">
                {t("reservations_desc")}: {selectedEvent.description}
              </Typography>
              <Typography variant="body1">
                {t("reservations_openness")}: {selectedEvent.open === true ? t("reservations_open") : t("reservations_closed")}
              </Typography>
              <Typography variant="body1">
                {t("reservations_room")}: {t(selectedEvent.room)}
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
            {t("remove_event")}
          </Button>
          <Button id="closeEvent" variant="outlined" onClick={handleCloseModal}>
            {t("close")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReservationsView;
