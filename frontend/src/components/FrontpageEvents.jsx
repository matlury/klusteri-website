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
import Divider from "@mui/material/Divider";
import { useTranslation } from "react-i18next";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RoomIcon from '@mui/icons-material/Room';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import moment from "moment/min/moment-with-locales";

// Event cards component - Robust responsive centering
const FrontpageEvents = ({ events }) => {
  const { t, i18n } = useTranslation();
  const [openDialogId, setOpenDialogId] = useState(null);

  const currentLang = i18n.language ? i18n.language.split('-')[0] : 'fi';
  
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

  const formatNative = (dateStr, options) => {
    return new Date(dateStr).toLocaleDateString(i18n.language || 'fi', options);
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, pb: 4, width: '100%' }}>
      {Object.keys(groupedEvents).map((dateStr, groupIndex) => {
        const dateObj = new Date(dateStr);
        const dayToday = isToday(dateStr);
        const dayTomorrow = isTomorrow(dateStr);

        return (
          <Box 
            key={dateStr} 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, // Stack on small, side-by-side on md+
              justifyContent: 'center', 
              alignItems: { xs: 'center', md: 'flex-start' }, 
              mb: { xs: 4, md: 6 },
              width: '100%',
              gap: { xs: 2, md: 0 }
            }}
          >
            {/* Left Column: Date Indicator (Fixed width on desktop to balance) */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              width: { xs: '100%', md: 120 }, // Wider on desktop for padding
              pr: { md: 3 },
              textAlign: 'center',
              flexShrink: 0
            }}>
              <Typography variant="caption" sx={{ 
                fontWeight: 800, 
                color: dayToday ? 'primary.main' : 'text.secondary',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                {dayToday ? t("today") : dayTomorrow ? t("tomorrow") : formatNative(dateStr, { weekday: 'short' }).replace('.', '')}
              </Typography>
              <Typography variant="h3" sx={{ 
                fontWeight: 900, 
                lineHeight: 1, 
                my: 0.5,
                color: dayToday ? 'primary.main' : 'text.primary',
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}>
                {dateObj.getDate()}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.7rem', color: 'text.secondary', textTransform: 'uppercase' }}>
                {formatNative(dateStr, { month: 'short' }).replace('.', '')}
              </Typography>
            </Box>

            {/* Middle Column: Event Cards Stack (The Centered Content) */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1.5,
              width: '100%',
              maxWidth: '600px', // Standardized width
              flexShrink: 1
            }}>
              {groupedEvents[dateStr].map((event, eventIndex) => {
                const isNext = groupIndex === 0 && eventIndex === 0;
                
                return (
                  <Card
                    key={event.id}
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      border: isNext ? '2px solid #558b2f' : '1px solid rgba(0,0,0,0.12)',
                      boxShadow: isNext ? '0px 8px 24px rgba(85, 139, 47, 0.12)' : '0px 2px 8px rgba(0,0,0,0.04)',
                      bgcolor: '#ffffff',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: "translateY(-2px)",
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    <CardContent sx={{ 
                      p: { xs: '12px !important', sm: '16px 20px !important' }, 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' }, // Stack content on very small screens
                      alignItems: { xs: 'flex-start', sm: 'center' }, 
                      justifyContent: 'space-between',
                      gap: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 3 }, flexGrow: 1 }}>
                        {/* Time Badge */}
                        <Box sx={{ 
                          minWidth: '60px',
                          textAlign: 'center',
                          bgcolor: isNext ? 'primary.main' : 'rgba(0,0,0,0.06)',
                          color: isNext ? 'white' : 'text.primary',
                          borderRadius: 2,
                          py: 0.75,
                          px: 1,
                          flexShrink: 0
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: 900, fontSize: '0.85rem' }}>
                            {moment(event.start).locale(currentLang).format("HH:mm")}
                          </Typography>
                        </Box>

                        {/* Event Details */}
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography variant="body1" sx={{ 
                            fontWeight: 800, 
                            lineHeight: 1.2, 
                            color: 'text.primary',
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            mb: 0.2
                          }}>
                            {event.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: { xs: 1, sm: 2 } }}>
                            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800 }}>
                              {event.organizer.name.toUpperCase()}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <RoomIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800 }}>
                                {t(event.room)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>

                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth={false}
                        onClick={() => handleClickOpen(event.id)}
                        sx={{ 
                          borderRadius: 2,
                          fontWeight: 800,
                          fontSize: '0.7rem',
                          textTransform: 'uppercase',
                          whiteSpace: 'nowrap',
                          alignSelf: { xs: 'flex-end', sm: 'center' }
                        }}
                      >
                        {t("moredetails")}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>

            {/* Right Column: Empty Spacer (Matches Date Indicator width to force centering) */}
            <Box sx={{ 
              display: { xs: 'none', md: 'block' }, 
              width: 120, 
              flexShrink: 0 
            }} />
          </Box>
        );
      })}

      {/* Dialogs */}
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
                  {moment(event.start).locale(currentLang).format("dddd D.M.YYYY")}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AccessTimeIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {moment(event.start).locale(currentLang).format("HH:mm")} - {moment(event.end).locale(currentLang).format("HH:mm")}
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
