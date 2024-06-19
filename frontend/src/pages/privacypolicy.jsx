import React from "react";
import { useTranslation } from "react-i18next";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        padding: 2,
        maxWidth: "800px",
        margin: "0 auto",
        textAlign: "left",
      }}
    >
      <Typography variant={isMobile ? "h4" : "h2"} gutterBottom>
        {t("privacy_1")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_2")}
      </Typography>
      <Typography variant={isMobile ? "h5" : "h3"} gutterBottom>
        {t("privacy_3")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_4")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_5")}
      </Typography>
      <Typography variant={isMobile ? "h5" : "h3"} gutterBottom>
        {t("privacy_6")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_7")}
      </Typography>
      <Typography variant={isMobile ? "h5" : "h3"} gutterBottom>
        {t("privacy_8")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_9")}
      </Typography>
      <Typography variant={isMobile ? "h5" : "h3"} gutterBottom>
        {t("privacy_10")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_11")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_12")}
      </Typography>
      <Typography variant={isMobile ? "h5" : "h3"} gutterBottom>
        {t("privacy_13")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_14")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_15")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_16")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_17")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_18")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_19")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_20")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_21")}
      </Typography>
      <Typography variant={isMobile ? "h5" : "h3"} gutterBottom>
        {t("privacy_22")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_23")}
      </Typography>
      <Typography variant={isMobile ? "h5" : "h3"} gutterBottom>
        {t("privacy_24")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_25")}
      </Typography>
      <Typography variant={isMobile ? "h5" : "h3"} gutterBottom>
        {t("privacy_26")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_27")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_28")}
      </Typography>
      <Typography variant={isMobile ? "h5" : "h3"} gutterBottom>
        {t("privacy_29")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_30")}
      </Typography>
      <Typography variant={isMobile ? "h5" : "h3"} gutterBottom>
        {t("privacy_31")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_32")}
      </Typography>
      <Typography variant={isMobile ? "h5" : "h3"} gutterBottom>
        {t("privacy_33")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_34")}
      </Typography>
      <Typography variant={isMobile ? "h5" : "h3"} gutterBottom>
        {t("privacy_35")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_36")}
      </Typography>
      <Typography variant={isMobile ? "h5" : "h3"} gutterBottom>
        {t("privacy_37")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("privacy_38")}
      </Typography>
    </Box>
  );
};

export default PrivacyPolicy;
