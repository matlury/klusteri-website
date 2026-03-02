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
  Box,
} from "@mui/material";
import { CSVLink } from "react-csv";
import { getCurrentDateTime } from "../utils/timehelpers";
import DownloadIcon from '@mui/icons-material/Download';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import OrgSelect from "./OrganizationChooseBox";
import { useTranslation } from "react-i18next";
import { useStateContext } from "@context/ContextProvider";

const ReservationsView = ({
  handleAddNewEventClick,
  handleSelectSlot,
  handleSelectEvent,
  onNavigate,
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

  const { user } = useStateContext();
  const admin = Boolean(user && user.role < 3);
  const res_rights = Boolean(
    user && ((user.role !== 5 && user.role !== 4) || user.rights_for_reservation === true)
  );

  const canEditEvent = Boolean(
    selectedEvent && (selectedEvent.created_by?.username === user?.username || admin)
  );

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

  const handleICal = () => {
    // Construct the absolute URL for the ical endpoint
    const icalUrl = `${window.location.origin}/api/events/ical/`;
    // Opening it in a new window/tab usually triggers the calendar app or download
    window.open(icalUrl, "_blank");
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button
          id="downloadICal"
          variant="outlined"
          onClick={handleICal}
          size="small"
          startIcon={<CalendarMonthIcon />}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          {t("icaldownload")}
        </Button>
        {admin && (
          <>
            <Button
              id="donwloadCSV"
              variant="outlined"
              onClick={handleCSV}
              size="small"
              startIcon={<DownloadIcon />}
              sx={{ borderRadius: 2, textTransform: 'none' }}
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
          </>
        )}
      </Box>
      <Box sx={{
        bgcolor: "#ffffff",
        p: 3,
        borderRadius: 4,
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        border: "1px solid rgba(0,0,0,0.04)"
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: "text.primary" }}>
                {t("reservations_res")}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
                {res_rights && (
                    <Button
                        id="createEvent"
                        variant="contained"
                        disableElevation
                        onClick={handleAddNewEventClick}
                        startIcon={<CalendarMonthIcon />}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            bgcolor: 'primary.main',
                            '&:hover': { bgcolor: 'primary.dark' }
                        }}
                    >
                        {t("reservations_add")}
                    </Button>
                )}
            </Box>
        </div>
        
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "calc(100vh - 300px)", minHeight: "600px" }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onNavigate={onNavigate}
          firstDay={1}
          popup={true}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.open === true ? "#90b557" : "#ef5350", // Use fresh green and softer red
              borderRadius: "6px",
              border: "none",
              color: "#fff",
              padding: "4px 8px",
              fontSize: "0.85rem",
              fontWeight: 600,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              margin: "2px 0"
            },
          })}
        />
      </Box>

      <Dialog open={showCreateModal} onClose={handleCloseModal}>
        <DialogTitle>{t("reservations_addform")}</DialogTitle>
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
                <MenuItem value="ChristinaRegina">Christina Regina</MenuItem>
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
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {t("reservations_desc")}: {selectedEvent.description || (<i>{t("nodescription")}</i>)}
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
          {canEditEvent &&
            <Button
              id="deleteEvent"
              variant="contained"
              color="error"
              onClick={() => handleDeleteEvent(selectedEvent.id)}
            >
              {t("remove_event")}
            </Button>
          }
          <Button id="closeEvent" variant="outlined" onClick={handleCloseModal}>
            {t("close")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReservationsView;
