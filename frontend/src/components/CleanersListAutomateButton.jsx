import React, { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import { Button } from "@mui/material";
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';

export default function CleanersListAutomateButton({ cleaners, threshold }) {
  const [loading, setLoading] = useState(true);
  const [newData, setNewData] = useState(cleaners);

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

      const weeks = 52;

      const list = [];

      for (let i = 0; i < weeks; i++) {
        const week = i + 1;
        const big = { name: bigOrgs[i % bigOrgs.length].name };
        const small = { name: smallOrgs[i % smallOrgs.length].name };
        list.push({ week, big, small });
      }

      console.log(list);

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
