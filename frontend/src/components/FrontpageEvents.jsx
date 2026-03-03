import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { useTranslation } from "react-i18next";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RoomIcon from '@mui/icons-material/Room';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import moment from "moment/min/moment-with-locales";

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
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'center', 
              alignItems: { xs: 'center', md: 'flex-start' }, 
              mb: { xs: 3, md: 6 },
              width: '100%',
              gap: { xs: 1, md: 0 }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'row', md: 'column' },
              alignItems: 'center', 
              justifyContent: 'center',
              width: { xs: '100%', md: 120 },
              pr: { md: 3 },
              mb: { xs: 1, md: 0 },
              gap: { xs: 1, md: 0.5 },
              flexShrink: 0
            }}>
              <Typography variant="caption" sx={{ 
                fontWeight: 800, 
                color: dayToday ? 'primary.main' : 'text.secondary',
                fontSize: { xs: '0.8rem', md: '0.75rem' },
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                {dayToday ? t("today") : dayTomorrow ? t("tomorrow") : formatNative(dateStr, { weekday: 'short' }).replace('.', '')}
              </Typography>
              <Typography variant="h3" sx={{ 
                fontWeight: 900, 
                lineHeight: 1, 
                color: dayToday ? 'primary.main' : 'text.primary',
                fontSize: { xs: '1.2rem', md: '2.5rem' },
                mx: { xs: 0.5, md: 0 }
              }}>
                {dateObj.getDate()}
              </Typography>
              <Typography variant="caption" sx={{ 
                fontWeight: 800, 
                fontSize: { xs: '0.8rem', md: '0.7rem' }, 
                color: 'text.secondary', 
                textTransform: 'uppercase' 
              }}>
                {formatNative(dateStr, { month: 'short' }).replace('.', '')}
              </Typography>
              <Box sx={{ display: { xs: 'block', md: 'none' }, flexGrow: 1, height: '1px', bgcolor: 'rgba(0,0,0,0.06)', ml: 1 }} />
            </Box>

            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1.2,
              width: '100%',
              maxWidth: '600px',
              flexShrink: 1
            }}>
              {groupedEvents[dateStr].map((event, eventIndex) => {
                const isNext = groupIndex === 0 && eventIndex === 0;
                
                return (
                  <Card
                    key={event.id}
                    variant="outlined"
                    onClick={() => handleClickOpen(event.id)}
                    sx={{
                      borderRadius: 3,
                      border: isNext ? '2px solid #558b2f' : '1px solid rgba(0,0,0,0.12)',
                      boxShadow: isNext ? '0px 4px 16px rgba(85, 139, 47, 0.1)' : 'none',
                      bgcolor: '#ffffff',
                      cursor: 'pointer',
                      overflow: 'hidden', // Required for the cylinder clipping
                      transition: 'all 0.2s ease-in-out',
                      position: 'relative',
                      '&:hover': {
                        transform: "scale(1.01)",
                        borderColor: 'primary.main',
                        boxShadow: '0px 6px 20px rgba(0,0,0,0.08)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', width: '100%' }}>
                      <CardContent sx={{ 
                        p: { xs: '12px 14px !important', sm: '16px 20px !important' }, 
                        flexGrow: 1,
                        display: 'flex', 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        gap: 1.5,
                        pr: { xs: 1, sm: 2 } // Keep some padding from the right bar
                      }}>
                        {/* Time Badge */}
                        <Box sx={{ 
                          minWidth: { xs: '50px', sm: '60px' },
                          textAlign: 'center',
                          bgcolor: isNext ? 'primary.main' : 'rgba(0,0,0,0.05)',
                          color: isNext ? 'white' : 'text.primary',
                          borderRadius: 2,
                          py: 0.5,
                          px: 0.5,
                          flexShrink: 0
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: 900, fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                            {moment(event.start).locale(currentLang).format("HH:mm")}
                          </Typography>
                        </Box>

                        {/* Event Details */}
                        <Box sx={{ textAlign: 'left', flexGrow: 1 }}>
                          <Typography variant="body1" sx={{ 
                            fontWeight: 800, 
                            lineHeight: 1.2, 
                            color: 'text.primary',
                            fontSize: { xs: '0.85rem', sm: '1rem' },
                            mb: 0.1
                          }}>
                            {event.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: { xs: 1, sm: 2 } }}>
                            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                              {event.organizer.name.toUpperCase()}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                              <RoomIcon sx={{ fontSize: '0.8rem', color: 'text.secondary' }} />
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                                {t(event.room)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>

                      {/* Info Bar (Flush to Right) */}
                      <Box sx={{
                        width: { xs: '35px', sm: '45px' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'primary.main',
                        color: 'white',
                        flexShrink: 0,
                        transition: 'background-color 0.2s',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}>
                        <InfoOutlinedIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                      </Box>
                    </Box>
                  </Card>
                );
              })}
            </Box>

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
