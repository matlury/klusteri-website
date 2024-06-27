import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

// Event cards component for the front page
const FrontpageEvents = ({ events }) => {
  const { t } = useTranslation();
  const [openDialogId, setOpenDialogId] = useState(null);

  const handleClickOpen = (eventId) => {
    setOpenDialogId(eventId);
  };

  const handleClose = () => {
    setOpenDialogId(null);
  };

  return (
    <>
      {events.map((event) => (
        <div key={event.id}>
          <Card
            sx={{ minWidth: 275, margin: 1, boxShadow: 4 }}
            variant="outlined"
          >
            <CardContent>
              <Typography variant="h5" component="div">
                {event.title} - {event.organizer.name}
              </Typography>
              <Typography color="text.secondary">
                {event.start.toLocaleDateString("no-NO", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                @ {event.room}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }}>
              <Button size="small" onClick={() => handleClickOpen(event.id)}>
                {t("moredetails")}
              </Button>
            </CardActions>
          </Card>
          <Dialog
            key={event.id}
            open={openDialogId === event.id}
            onClose={handleClose}
          >
            <DialogTitle>
              {event.title} - {event.organizer.name}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {event.description}
                <br />
                <br />
                {event.start.toLocaleDateString("no-NO", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {event.end.toLocaleDateString("no-NO", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                <br />
                {t("reservations_room")}: {event.room}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                {t("close")}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      ))}
    </>
  );
};

export default FrontpageEvents;
