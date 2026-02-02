import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import FrontpageEvents from "../components/FrontpageEvents";
import axios from "axios";

const API_URL = process.env.VITE_API_URL;

const FrontPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [events, setEvents] = useState(null);

  // Fetch the events to be shown from the backend
  useEffect(() => {
    const now = new Date();
    const futureLimit = new Date();
    futureLimit.setDate(now.getDate() + 30); // Fetch next 30 days

    axios
      .get(`${API_URL}/api/listobjects/events/`, {
        params: {
          start: now.toISOString(),
          end: futureLimit.toISOString()
        }
      })
      .then((response) => {
        // Handle both paginated and non-paginated responses
        const rawData = response.data.results || response.data;
        const events = rawData
          .filter(
            (event) => new Date() < new Date(event.start) && event.open == true,
          )
          .map((event) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          }))
          .sort((a, b) => new Date(a.start) - new Date(b.start))
          .slice(0, 10);
        setEvents(events);
        if (events.length === 0) {
          setEvents(undefined)
        }
      })
      .catch((error) => {
        console.error(t("errorfetchevents"), error);
      });
  }, []);

  return (
    <div>
      <Box
        sx={{
          padding: 2,
          maxWidth: "600px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <Typography
          variant={isMobile ? "h4" : "h2"}
          component="h1"
          gutterBottom
        >
          Ilotalo
        </Typography>
        <Typography variant="body1" paragraph>
          ”sub hoc tecto cives academici excoluntur”?
        </Typography>
        <Typography variant="body1" paragraph>
          {t("front_1")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("front_2")}
        </Typography>
      </Box>
      <Box
        sx={{
          padding: 2,
          maxWidth: "600px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h4"}
          component="h1"
          gutterBottom
        >
          {t("openevents")}
        </Typography>
        {events === null ? (
          <Typography>{t("loadingevents")}</Typography>
        ) : events === undefined ? (
          <Typography>{t("noevents")}</Typography>
        ) : (
          <FrontpageEvents events={events} />
        )}
      </Box>
    </div>
  );
};

export default FrontPage;
