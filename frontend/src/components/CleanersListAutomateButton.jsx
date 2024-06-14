/* istanbul ignore file */
// this file is ignored in the tests because jest doesn't work with uploading data

import React, { useState } from "react";
import { Button } from "@mui/material";
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import axiosClient from "../axios.js";
import AutomateCleanersDialog from "./AutomateCleanersDialog.jsx";
import { useTranslation } from "react-i18next";

export default function CleanersListAutomateButton({ updateNewData }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleAutomate = async (threshold) => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/listobjects/organizations/");
      const orgdata = response.data;

      // Check if orgdata is an array
      if (!Array.isArray(orgdata)) {
        throw new Error("Unexpected API response format");
      }

      const bigOrgs = getBigOrgs(orgdata, threshold);
      const smallOrgs = getSmallOrgs(orgdata, threshold);

      const weeks = getWeeks(new Date().getFullYear());

      const list = [];

      for (let i = 0; i < weeks; i++) {
        const week = i + 1;
        const big = { name: bigOrgs[i % bigOrgs.length].name };
        const small = { name: smallOrgs[i % smallOrgs.length].name };
        list.push({ week, big, small });
      }

      updateNewData(list); // Update newData with the generated list

      return list;
    } catch (error) {
      console.error("Error fetching organization data:", error);
    } finally {
      setLoading(false);
    }
  };

  function getBigOrgs(orgdata, threshold) {
    return orgdata.filter((org) => org.user_set.length >= threshold);
  }

  function getSmallOrgs(orgdata, threshold) {
    return orgdata.filter((org) => org.user_set.length < threshold && org.user_set.length > 0);
  }

  function getWeeks(year) {
    let firstDayOfYear = new Date(year, 0, 1);
    let lastDayOfYear = new Date(year, 11, 31);
    let dayOfWeek = firstDayOfYear.getDay(); // 0 (Sunday) to 6 (Saturday)
    let daysToMonday = (dayOfWeek === 0 ? 7 : dayOfWeek) - 1; // days to subtract to get to the previous Monday
    firstDayOfYear = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() - daysToMonday));
    const daysInYear = (lastDayOfYear - firstDayOfYear) / (1000 * 60 * 60 * 24) + 1;
    return Math.ceil(daysInYear / 7);
  }

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        component="label"
        onClick={handleClickOpen}
        startIcon={<SmartToyOutlinedIcon />}
        disabled={loading}
      >
        {t("cleaningcreatelist")}
      </Button>
      <AutomateCleanersDialog 
        open={dialogOpen}
        handleClose={handleClose}
        handleAutomate={handleAutomate}
      />
    </div>
  );
}
