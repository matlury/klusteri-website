/* istanbul ignore file */
// this file is ignored in the tests because jest doesn't work with the charts
import React, { useEffect, useState } from "react";
import { usersAPI, organizationsAPI, eventsAPI, nightResponsibilitiesAPI, authAPI } from "../api/api.ts";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { Grid, Box, Typography, TextField, Radio, RadioGroup, FormControlLabel, FormControl, Stack } from "@mui/material";
import { CSVLink } from "react-csv";
import { getCurrentDateTime } from "../utils/timehelpers";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import { useTranslation } from "react-i18next";

// Color palette for organizations
const ORG_COLORS = [
  "#2196f3", "#4caf50", "#ff9800", "#f44336", "#9c27b0",
  "#00bcd4", "#ffeb3b", "#795548", "#607d8b", "#e91e63",
  "#3f51b5", "#009688", "#8bc34a", "#cddc39", "#ffc107",
  "#ff5722", "#9e9e9e", "#03a9f4", "#43a047", "#d81b60"
];

const generateRandomColor = (seed) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

// This page is used to display statistics about users and organizations
const Statistics = () => {
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [orgColorMap, setOrgColorMap] = useState({});
  // YKV by organization
  const [orgStatsData, setOrgStatsData] = useState([]);

  // YKV count by user
  const [allUserStatsData, setAllUserStatsData] = useState([]);

  // CSV data and the flag to download the CSV
  const [CSVdata, setCSVdata] = useState(null);
  const [shouldDownload, setShouldDownload] = useState(false);

  // Time filters
  // Default filters to the last 24 hours
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const formatForInput = (date) => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    return (new Date(date - tzoffset)).toISOString().slice(0, 16);
  };

  const [minFilter, setMinFilter] = useState(formatForInput(yesterday));
  const [maxFilter, setMaxFilter] = useState(formatForInput(now));

  // Fetched data from the backend
  const [fetchedData, setFetchedData] = useState(null);

  // YKV login and logout times per hour data
  const [logTimesData, setLogTimesData] = useState(null);
  const [widthDivider, setWidthDivider] = useState(2.5);

  // YKV per weekday data
  const [logsPerWeekDayData, setLogsPerWeekDayData] = useState([]);

  // Keys by organization
  const [orgMembersData, setOrgMembersData] = useState([]);

  // Late YKV logouts by organization
  const [orgLateData, setOrgLateData] = useState([]);

  // Data to be displayed in the pie chart and the selected pie chart option
  const [pieChartData, setPieChartData] = useState([]);
  const [selectedPie, setSelectedPie] = useState(1);

  // Gets the user's role from backend and fetches data. 
  useEffect(() => {
    const init = async () => {
      await getPermission();
      if (localStorage.getItem("ACCESS_TOKEN")) {
        fetchData().then(setFetchedData);
      }
    };
    init();
  }, []);

  // Updates the data when the filters change
  useEffect(() => {
    // Changes the grid column widths when the window is resized
    if (fetchedData && userRole !== null) {
      const { orgs, resps, users } = fetchedData;
      processOrgStats(orgs, resps);
      processAllUserStats(users, resps, orgs);
    }
  }, [fetchedData, userRole, minFilter, maxFilter, selectedPie]);

  useEffect(() => {
    const updateWidth = () => {
      setWidthDivider(window.innerWidth <= window.innerHeight ? 1.2 : 2.5);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const { t } = useTranslation();

  const fetchData = async () => {
    try {
      const [orgResponse, userResponse, responsibilitiesResponse] = await Promise.all([
        organizationsAPI.organizationsWithKeys(),
        usersAPI.getUsers(),
        nightResponsibilitiesAPI.getNightResponsibilities(),
      ]);
      return {
        orgs: orgResponse.data,
        resps: responsibilitiesResponse.data,
        users: userResponse.data
      };
    } catch (error) { console.error("Error fetching data", error); }
  };

  const getPermission = async () => {
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    if (accessToken) {
      try {
        const response = await authAPI.getUserInfo();
        setUsername(response.data.username);
        setUserRole(response.data.role);
      } catch (e) {
        console.error(e);
        setUserRole(5); // Fallback to basic role if info fetch fails but token exists
      }
    }
  };

  function filtering(login_time, logout_time) {
    const login = Date.parse(login_time);
    const logout = Date.parse(logout_time);
    const min = minFilter ? Date.parse(minFilter) : -Infinity;
    const max = maxFilter ? Date.parse(maxFilter) : Infinity;
    return (login >= min && login <= max) || (logout <= max && logout >= min);
  }

  // Sets the organization data and the organization member data
  const processOrgStats = (orgData, responsibilities) => {
    const orgdata = {};
    const orgmemdata = {};
    const newColorMap = { ...orgColorMap };
    const usedColors = new Set(Object.values(newColorMap));

    const finalOrgData = orgData.map((org, index) => {
      let color = org.color;
      // Treat null, empty, or black as "missing color"
      if (!color || color === "#000000" || color === "null") {
        if (newColorMap[org.name]) {
          color = newColorMap[org.name];
        } else {
          const paletteColor = ORG_COLORS[index % ORG_COLORS.length];
          color = usedColors.has(paletteColor) ? generateRandomColor(org.name) : paletteColor;
          newColorMap[org.name] = color;
          usedColors.add(color);
        }
      } else {
        usedColors.add(color);
      }
      return { ...org, assignedColor: color };
    });

    if (Object.keys(newColorMap).length > Object.keys(orgColorMap).length) {
      setOrgColorMap(newColorMap);
    }

    finalOrgData.forEach((org) => {
      const baseObj = { id: org.id, label: org.name, color: org.assignedColor };
      orgdata[org.name] = { ...baseObj, value: 0 };
      orgmemdata[org.name] = { ...baseObj, value: org.user_set ? org.user_set.length : 0 };
    });

    responsibilities.forEach((resp) => {
      resp.organizations.forEach((org) => {
        if (filtering(resp.login_time, resp.logout_time) && orgdata[org.name]) {
          orgdata[org.name].value += 1;
        }
      });
    });

    const mData = Object.values(orgmemdata).sort((a, b) => b.value - a.value);
    const sData = Object.values(orgdata).sort((a, b) => b.value - a.value);
    setOrgMembersData(mData);
    setOrgStatsData(sData);

    if (selectedPie === 1) setPieChartData(mData);

    else if (selectedPie === 2) setPieChartData(sData);
  };

  // Sets the user data and ykv data
  const processAllUserStats = (users, responsibilities, orgdata) => {
    const userdata = {};

    const latedata = {};

    const logintimesdata = new Array(24).fill(0);
    const logouttimesdata = new Array(24).fill(0);

    const lpddata = new Array(7).fill(0);

    const numberdayweek = [6, 0, 1, 2, 3, 4, 5];

    orgdata.forEach((org, index) => {
      latedata[org.name] = { id: org.id, label: org.name, value: 0, color: org.color || orgColorMap[org.name] || ORG_COLORS[index % ORG_COLORS.length] };
    });
    users.forEach((usr) => { userdata[usr.username] = { id: usr.id, data: [0], label: usr.username }; });
    responsibilities.forEach((resp) => {
      if (userdata[resp.user.username] && filtering(resp.login_time, resp.logout_time)) {
        userdata[resp.user.username].data[0] += 1;
        logintimesdata[new Date(resp.login_time).getHours()] += 1;
        if (resp.logout_time) logouttimesdata[new Date(resp.logout_time).getHours()] += 1;
        lpddata[numberdayweek[new Date(resp.login_time).getDay()]] += 1;
        if (resp.late) {
          resp.organizations.forEach((org) => {
            if (latedata[org.name]) {
              latedata[org.name].value += 1;
            }
          });
        }
      }
    });
    // Handles the creation of the event CSV file
    const lateArr = Object.values(latedata).sort((a, b) => b.value - a.value);
    setOrgLateData(lateArr);
    setLogTimesData([
      { data: logintimesdata, label: t("statslogin"), color: "#4caf50", showMark: () => false },
      { data: logouttimesdata, label: t("statslogout"), color: "#f44336", showMark: () => false }
    ]);
    setLogsPerWeekDayData([{ data: lpddata, color: "#2196f3" }]);
    setAllUserStatsData(Object.values(userdata)
      .filter(u => u.data[0] > 0)
      .sort((a, b) => b.data[0] - a.data[0]));
    if (selectedPie === 3) setPieChartData(lateArr);
  };

  // Handles the creation of the event CSV file
  const handleCSV = async () => {
    try {
      // Use current filters for the CSV download
      const params = new URLSearchParams();
      if (minFilter) params.append("start", minFilter);
      if (maxFilter) params.append("end", maxFilter);

      // If no filters are set, we explicitly ask for 'all' to ensure the backend
      // doesn't just return the current month, but the full history.
      if (!minFilter && !maxFilter) params.append("all", "true");

      const response = await eventsAPI.getEventsWithParams(params);
      const rawData = response.data;
      const data = [[
        "START",
        "END",
        "ORGANIZER",
        "TITLE",
        "DESCRIPTION",
        "RESPONSIBLE",
        "ROOM",
        "OPEN"
      ]];
      rawData.forEach((e) => {
        if (filtering(e.start, e.end)) {
          data.push([
            e.start,
            e.end,
            e.organizer ? e.organizer.name : "",
            e.title,
            e.description,
            e.responsible,
            e.room,
            e.open
          ]);
        }
      });
      setCSVdata(data);
      setShouldDownload(true);
    } catch (error) {
      console.error(error);
    }
  };


  const date = getCurrentDateTime();
  // Handles the change of the pie chart data
  const handleChange = (event) => {
    const val = parseInt(event.target.value);
    setSelectedPie(val);
  };
  if (userRole === null) {
    return <p>{t("login")}</p>;
  }

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 1, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>{t("timefilter")}</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label={t("start")} type="datetime-local" value={minFilter} onChange={(e) => setMinFilter(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
              <TextField label={t("end")} type="datetime-local" value={maxFilter} onChange={(e) => setMaxFilter(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-end' } }}>
          <Button variant="contained" onClick={handleCSV} startIcon={<DownloadIcon />} size="large" sx={{ height: 56 }}>{t("csvdownload")}</Button>
          {shouldDownload && CSVdata && <CSVLink data={CSVdata} filename={`klusteri-events-${date}.csv`} target="_blank" asyncOnClick={true}><DownloadIcon /></CSVLink>}
        </Grid>

        <Grid item xs={12} lg={7}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 1, borderRadius: 2, height: '100%' }}>
            <Typography variant="h5" gutterBottom>{t("orgstats")}</Typography>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <RadioGroup row value={selectedPie.toString()} onChange={handleChange}>
                <FormControlLabel value="1" control={<Radio />} label={t("orgstats_1")} />
                <FormControlLabel value="2" control={<Radio />} label={t("orgstats_2")} />
                <FormControlLabel value="3" control={<Radio />} label={t("orgstats_3")} />
              </RadioGroup>
            </FormControl>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={7}>
                <PieChart
                  series={[{
                    data: pieChartData.filter(d => d.value > 0),
                    innerRadius: 40, outerRadius: 130, paddingAngle: 2, cornerRadius: 5,
                    arcLabel: (item) => `${item.value}`,
                  }]}
                  width={400} height={350} slotProps={{ legend: { hidden: true } }}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <Box sx={{ maxHeight: 350, overflowY: 'auto', pr: 1 }}>
                  {pieChartData.map((item, i) => (
                    <Box key={item.id || i} sx={{ display: 'flex', alignItems: 'center', mb: 1, opacity: item.value > 0 ? 1 : 0.5 }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: item.color, mr: 1, borderRadius: '50%', flexShrink: 0 }} />
                      <Typography variant="caption" sx={{ fontWeight: item.value > 0 ? 'bold' : 'normal', flex: 1 }}>{item.label}</Typography>
                      <Typography variant="caption" sx={{ ml: 1 }}>{item.value}</Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 1, borderRadius: 2, height: '100%' }}>
            <Typography variant="h5" gutterBottom>{t("userstats_1")}</Typography>
            <BarChart height={400} series={allUserStatsData.slice(0, 10)} yAxis={[{ data: [""], scaleType: "band" }]} layout="horizontal" borderRadius={5} margin={{ left: 20, right: 20 }} />
          </Box>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 1, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>{t("userstats_2")}</Typography>
            <BarChart series={logsPerWeekDayData} xAxis={[{ scaleType: "band", data: [t("monday"), t("tuesday"), t("wednesday"), t("thursday"), t("friday"), t("saturday"), t("sunday")] }]} height={350} borderRadius={5} />
          </Box>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 1, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>{t("userstats_3")}</Typography>
            <LineChart series={logTimesData || []} height={350} borderRadius={5} margin={{ left: 40, right: 40 }} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Statistics;