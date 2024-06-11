import React, { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import { Button } from "@mui/material";
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';

export default function CleanersListAutomateButton({ threshold, updateNewData }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const buildList = async (event) => {
    try {
      const response = await axiosClient.get("/listobjects/organizations/");
      const orgdata = response.data;

      // Check if orgdata is an array
      if (!Array.isArray(orgdata)) {
        throw new Error("Unexpected API response format");
      }

      const bigOrgs = getBigOrgs(orgdata);
      const smallOrgs = getSmallOrgs(orgdata);

      const weeks = getWeeks(new Date().getFullYear());

      const list = [];

      for (let i = 0; i < weeks; i++) {
        const week = i + 1;
        const big = { name: bigOrgs[i % bigOrgs.length].name };
        const small = { name: smallOrgs[i % smallOrgs.length].name };
        list.push({ week, big, small });
      }

      console.log(list);
      updateNewData(list); // Update newData with the generated list

      return list;
    } catch (error) {
      console.error("Error fetching organization data:", error);
    }
  };

  function getBigOrgs(orgdata) {
    return orgdata.filter((org) => org.user_set.length >= threshold);
  }

  function getSmallOrgs(orgdata) {
    return orgdata.filter((org) => org.user_set.length < threshold);
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
    <Button
      variant="contained"
      color="primary"
      component="label"
      onClick={buildList}
      startIcon={<SmartToyOutlinedIcon />}
      disabled={loading}
    >
      Tee lista
    </Button>
  );
}
