import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { useTranslation } from "react-i18next";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RoomIcon from '@mui/icons-material/Room';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import moment from "moment";

// Event cards component for the front page - Optimized for space and clarity
const FrontpageEvents = ({ events }) => {
  const { t } = useTranslation();
  const [openDialogId, setOpenDialogId] = useState(null);

  const handleClickOpen = (eventId) => {
    setOpenDialogId(eventId);
  };

  const handleClose = () => {
    setOpenDialogId(null);
  };

  // Group events by date
  const groupedEvents = events.reduce((groups, event) => {
    const date = moment(event.start).format("YYYY-MM-DD");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {});

  const isToday = (dateStr) => moment(dateStr).isSame(moment(), 'day');
  const isTomorrow = (dateStr) => moment(dateStr).isSame(moment().add(1, 'day'), 'day');

  return (
    <Box sx={{ px: { xs: 0, sm: 2 }, pb: 4, maxWidth: '800px', margin: '0 auto' }}>
      {Object.keys(groupedEvents).map((dateStr, groupIndex) => {
        const dateMoment = moment(dateStr);
        const dayToday = isToday(dateStr);
        const dayTomorrow = isTomorrow(dateStr);

        return (
          <Grid container spacing={0} key={dateStr} sx={{ mb: 2, position: 'relative' }}>
            {/* Left Column: Date Indicator */}
            <Grid item xs={3} sm={2} sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pt: 1,
              borderRight: '2px solid rgba(0,0,0,0.05)'
            }}>
              <Typography variant="caption" sx={{
                fontWeight: 800,
                color: dayToday ? 'primary.main' : 'text.secondary',
                fontSize: '0.7rem',
                textTransform: 'uppercase'
              }}>
                {dayToday ? t("today") : dayTomorrow ? t("tomorrow") : dateMoment.format("ddd")}
              </Typography>
              <Typography variant="h5" sx={{
                fontWeight: 900,
                lineHeight: 1,
                my: 0.5,
                color: dayToday ? 'primary.main' : 'text.primary'
              }}>
                {dateMoment.date()}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.65rem', color: 'text.secondary' }}>
                {dateMoment.format("MMM").toUpperCase()}
              </Typography>
            </Grid>

            {/* Right Column: Events for this day */}
            <Grid item xs={9} sm={10} sx={{ pl: { xs: 1, sm: 3 } }}>
              {groupedEvents[dateStr].map((event, eventIndex) => {
                const isNext = groupIndex === 0 && eventIndex === 0;

                return (
                  <Card
                    key={event.id}
                    variant="outlined"
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      border: isNext ? '1px solid #90b557' : '1px solid rgba(0,0,0,0.08)',
                      boxShadow: isNext ? '0px 4px 12px rgba(144, 181, 87, 0.1)' : 'none',
                      bgcolor: '#ffffff',
                      '&:hover': {
                        bgcolor: 'rgba(144, 181, 87, 0.02)',
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <CardContent sx={{
                      p: '12px !important',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                        {/* Time */}
                        <Box sx={{
                          minWidth: '50px',
                          textAlign: 'center',
                          bgcolor: isNext ? 'primary.main' : 'rgba(0,0,0,0.04)',
                          color: isNext ? 'white' : 'text.primary',
                          borderRadius: 1.5,
                          py: 0.5,
                          px: 1
                        }}>
                          <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.75rem' }}>
                            {moment(event.start).format("HH:mm")}
                          </Typography>
                        </Box>

                        {/* Title & Info */}
                        <Box>
                          <Typography variant="body1" sx={{
                            fontWeight: 700,
                            lineHeight: 1.2,
                            color: 'text.primary',
                            fontSize: { xs: '0.9rem', sm: '1rem' }
                          }}>
                            {event.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.2 }}>
                            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>
                              {event.organizer.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                              <RoomIcon sx={{ fontSize: '0.8rem', color: 'text.secondary' }} />
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                {t(event.room)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>

                      {/* Action */}
                      <Button
                        size="small"
                        onClick={() => handleClickOpen(event.id)}
                        sx={{
                          minWidth: 'auto',
                          p: 0.5,
                          borderRadius: 1,
                          color: 'primary.main',
                          fontWeight: 800,
                          fontSize: '0.7rem'
                        }}
                      >
                        {t("moredetails").toUpperCase()}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </Grid>
          </Grid>
        );
      })}

      {/* Reusable Dialog */}
      {events.map(event => (
        <Dialog
          key={`dialog-${event.id}`}
          open={openDialogId === event.id}
          onClose={handleClose}
          fullWidth
          maxWidth="xs"
          PaperProps={{ sx: { borderRadius: 4 } }}
        >
          <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
            {event.title}
          </DialogTitle>
          <DialogContent dividers sx={{ py: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="overline" sx={{ color: "primary.main", fontWeight: 800, display: 'block', mb: 1 }}>
                {event.organizer.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CalendarTodayIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {moment(event.start).format("dddd D.M.YYYY")}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AccessTimeIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {moment(event.start).format("HH:mm")} - {moment(event.end).format("HH:mm")}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RoomIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {t(event.room)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: 'text.primary', lineHeight: 1.6 }}>
              {event.description || (<i>{t("nodescription")}</i>)}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={handleClose}
              variant="contained"
              fullWidth
              disableElevation
              sx={{ borderRadius: 2.5, fontWeight: 700 }}
            >
              {t("close")}
            </Button>
          </DialogActions>
        </Dialog>
      ))}
    </Box>
  );
};

export default FrontpageEvents;
