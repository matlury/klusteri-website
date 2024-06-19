import React from "react";
import { useTranslation } from "react-i18next";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

const FrontPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
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
  );
};

export default FrontPage;
