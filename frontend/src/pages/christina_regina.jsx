import React from "react";
import christinaregina from "../ChristinaRegina.png";
import { useTranslation } from "react-i18next";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

const ChristinaRegina = () => {
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
        Christina Regina
      </Typography>
      <Typography variant="body1" paragraph>
        {t("christina_regina_1")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("front_1")} {t("front_2")} {t("christina_regina_2")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("christina_regina_3")}
      </Typography>
      <Box
        component="img"
        src={christinaregina}
        alt="Christina Regina"
        sx={{
          display: "block",
          maxWidth: "100%",
          height: "auto",
          margin: "0 auto",
        }}
      />
    </Box>
  );
};

export default ChristinaRegina;
