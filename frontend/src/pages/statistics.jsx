/* istanbul ignore file */
// this file is ignored in the tests because jest doesn't work with the charts
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import axiosClient from "../axios";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { Grid } from "@mui/material";
import { CSVLink } from "react-csv";
import { getCurrentDateTime } from "../utils/timehelpers";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import DownloadIcon from "@mui/icons-material/Download";
import { useTranslation } from "react-i18next";

const API_URL = process.env.API_URL;

const Statistics = () => {
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [orgStatsData, setOrgStatsData] = useState([]);
  const [allUserStatsData, setAllUserStatsData] = useState([]);
  const [CSVdata, setCSVdata] = useState(null);
  const [shouldDownload, setShouldDownload] = useState(false);
  const [minFilter, setMinFilter] = useState("");
  const [maxFilter, setMaxFilter] = useState("");
  const [fetchedData, setFetchedData] = useState(null);
  const [logTimesData, setLogTimesData] = useState(null);
  const [winHeight, setWinHeight] = useState(window.innerHeight);
  const [winWidth, setWinWidth] = useState(window.innerWidth);
  const [columnWidth, setColumnWidth] = useState(6);
  const [widthDivider, setWidthDivider] = useState(2.5);
  const [logsPerWeekDayData, setLogsPerWeekDayData] = useState([]);
  const [orgMembersData, setOrgMembersData] = useState([]);
  const [orgLateData, setOrgLateData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [selectedPie, setSelectedPie] = useState(1)

  useEffect(() => {
    getPermission();
    if (fetchedData) {
      processOrgStats(
        fetchedData.orgResponse.data,
        fetchedData.responsibilitiesResponse.data,
      );
      processAllUserStats(
        fetchedData.userResponse.data,
        fetchedData.responsibilitiesResponse.data,
        fetchedData.orgResponse.data,
      );
    } else if (localStorage.getItem("ACCESS_TOKEN")) {
      fetchData().then(setFetchedData);
    }
    if (window.innerWidth <= window.innerHeight) {
      setColumnWidth(12);
      setWidthDivider(1.2);
    }
  }, []);

  useEffect(() => {
    if (fetchedData) {
      processOrgStats(
        fetchedData.orgResponse.data,
        fetchedData.responsibilitiesResponse.data,
      );
      processAllUserStats(
        fetchedData.userResponse.data,
        fetchedData.responsibilitiesResponse.data,
        fetchedData.orgResponse.data,
      );
    }
  }, [minFilter, maxFilter, fetchedData]);

  useEffect(() => {
    const handleResize = () => {
      setWinWidth(window.innerWidth);
      setWinHeight(window.innerHeight);
      if (window.innerWidth <= window.innerHeight) {
        setColumnWidth(12);
        setWidthDivider(1.2);
      } else {
        setColumnWidth(6);
        setWidthDivider(2.5);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { t } = useTranslation();

  const fetchData = async () => {
    try {
      const [orgResponse, userResponse, responsibilitiesResponse] =
        await Promise.all([
          axiosClient.get("listobjects/organizations/"),
          axiosClient.get("listobjects/users/"),
          axiosClient.get("listobjects/nightresponsibilities/"),
        ]);
      return { orgResponse, userResponse, responsibilitiesResponse };
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const getPermission = async () => {
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    if (accessToken) {
      await axios
        .get(`${API_URL}/api/users/userinfo`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setUsername(response.data.username);
          setUserRole(response.data.role);
        });
    }
  };

  function filtering(login_time, logout_time) {
    return (
      (Date.parse(login_time) >= Number(Date.parse(minFilter)) &&
        Date.parse(login_time) <= Number(Date.parse(maxFilter))) ||
      (Date.parse(logout_time) <= Number(Date.parse(maxFilter)) &&
        Date.parse(logout_time) >= Number(Date.parse(minFilter))) ||
      (Date.parse(login_time) >= Number(Date.parse(minFilter)) &&
        maxFilter === "") ||
      (Date.parse(logout_time) <= Number(Date.parse(maxFilter)) &&
        minFilter === "") ||
      (minFilter === "" && maxFilter === "")
    );
  }

  const processOrgStats = (orgData, responsibilities) => {
    const orgdata = {};

    const orgmemdata = {};

    orgData.forEach((org) => {
      orgdata[org.name] = { value: 0, label: org.name, ...(org.color ? { color: org.color } : {}) };
      orgmemdata[org.name] = { value: org.user_set.length, label: org.name, ...(org.color ? { color: org.color } : {}) };
    });

    setOrgMembersData(Object.values(orgmemdata));

    responsibilities.forEach((resp) => {
      resp.organizations.forEach((org) => {
        if (filtering(resp.login_time, resp.logout_time)) {
          orgdata[org.name] = {
            ...orgdata[org.name],
            value: orgdata[org.name].value + 1,
          };
        }
      });
    });
    const realdata = Object.values(orgdata);
    setOrgStatsData(realdata);

    if (selectedPie == 1) {
        setPieChartData(Object.values(orgmemdata));
    } else if (selectedPie == 2) {
      setPieChartData(Object.values(orgdata));
    }
  };

  const processAllUserStats = (users, responsibilities, orgdata) => {
    const userdata = {};

    const latedata = {};

    const logintimesdata = new Array(24).fill(0);
    const logouttimesdata = new Array(24).fill(0);

    const lpddata = new Array(7).fill(0);

    const numberdayweek = [6, 0, 1, 2, 3, 4, 5];

    orgdata.forEach((org) => {
      latedata[org.name] = { value: 0, label: org.name, ...(org.color ? { color: org.color } : {})};
    });
    users.forEach((usr) => {
      userdata[usr.username] = { data: [0], label: usr.username };
    });
    responsibilities.forEach((resp) => {
      if (userdata[resp.user.username]) {
        if (filtering(resp.login_time, resp.logout_time)) {
          userdata[resp.user.username] = {
            ...userdata[resp.user.username],
            data: [userdata[resp.user.username].data[0] + 1],
          };
          const loginhours = new Date(resp.login_time).getHours();
          const logouthours = new Date(resp.logout_time).getHours();
          logintimesdata[loginhours] += 1;
          logouttimesdata[logouthours] += 1;

          const day = new Date(resp.login_time).getDay();
          lpddata[numberdayweek[day]] += 1;

          if (resp.late) {
            resp.organizations.forEach((org) => {
              latedata[org.name].value += 1;
            });
          }
        }
      }
    });

    setOrgLateData(Object.values(latedata));

    Object.values(userdata).forEach((usr) => {
      if (usr.data.reduce((partialSum, a) => partialSum + a, 0) === 0) {
        delete userdata[usr.label];
      }
    });
    const logs = [
      {
        data: logintimesdata,
        label: t("statslogin"),
        color: "lightGreen",
        showMark: ({ index }) => index === -1,
      },
      {
        data: logouttimesdata,
        label: t("statslogout"),
        color: "red",
        showMark: ({ index }) => index === -1,
      },
    ];
    setLogTimesData(logs);

    const logsperday = [{ data: lpddata }];
    setLogsPerWeekDayData(logsperday);

    const realdata = Object.values(userdata);
    realdata.sort(
      (a, b) =>
        parseFloat(b.data.reduce((partialSum, b) => partialSum + b, 0)) -
        parseFloat(a.data.reduce((partialSum, a) => partialSum + a, 0)),
    );
    setAllUserStatsData(realdata);

    if (selectedPie == 3) {
      setPieChartData(Object.values(latedata));
  }
  };

  const handleCSV = async () => {
    try {
      const events = await axiosClient.get("listobjects/events/");
      if (events.data) {
        const data = [
          [
            "START",
            "END",
            "ORGANIZER",
            "TITLE",
            "DESCRIPTION",
            "RESPONSIBLE",
            "ROOM",
            "OPEN",
          ],
        ];
        events.data.forEach((e) => {
          if (filtering(e.start, e.end)) {
          data.push([
            e.start,
            e.end,
            e.organizer.name,
            e.title,
            e.description,
            e.responsible,
            e.room,
            e.open,
          ]);
          }
        });
        setCSVdata(data);
        setShouldDownload(true);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const CSVDownload = (props) => {
    const btnRef = useRef(null);
    useEffect(() => {
      if (btnRef.current) {
        btnRef.current.click();
        setShouldDownload(false);
      }
    }, [btnRef]);

    return (
      <CSVLink {...props}>
        <span ref={btnRef} />
      </CSVLink>
    );
  };

  const handleMaxFilterChange = (event) => {
    setMaxFilter(event.target.value);
  };
  const handleMinFilterChange = (event) => {
    setMinFilter(event.target.value);
  };

  const date = getCurrentDateTime();

  const handleChange = (event) => {
    if (event.target.value == 1) {
      setPieChartData(orgMembersData);
      setSelectedPie(1)
    } else if (event.target.value == 2) {
      setPieChartData(orgStatsData);
      setSelectedPie(2)
    } else if (event.target.value == 3) {
      setPieChartData(orgLateData);
      setSelectedPie(3)
    }
  };

  if (userRole === 5 || userRole == null) {
    return <p>{t("login")}</p>;
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={columnWidth}>
          <div>
            <p>{t("timefilter")}</p>
            <input type="hidden" id="timezone" name="timezone" value="03:00" />
            <input
              value={minFilter}
              onChange={handleMinFilterChange}
              type="datetime-local"
            />
            <input
              value={maxFilter}
              onChange={handleMaxFilterChange}
              type="datetime-local"
            />
          </div>
        </Grid>
        <Grid item xs={columnWidth}>
          <div style={{ float: "right" }}>
            <Button
              type="button"
              variant="contained"
              onClick={handleCSV}
              startIcon={<DownloadIcon />}
            >
              {t("csvdownload")}
            </Button>
            {shouldDownload && CSVdata && (
              <CSVDownload
                data={CSVdata}
                filename={`klusteri-events-${date}.csv`}
                target="_blank"
              />
            )}
          </div>
        </Grid>
        <Grid item xs={columnWidth}>
          <h2>{t("orgstats")}</h2>
          <FormControl>
            <FormLabel id="radio-buttons-group" />
            <RadioGroup
              row
              aria-labelledby="radio-buttons-group"
              name="radio-buttons-group"
              defaultValue="1"
              onChange={handleChange}
            >
              <FormControlLabel
                value="1"
                control={<Radio />}
                label={t("orgstats_1")}
              />
              <FormControlLabel
                value="2"
                control={<Radio />}
                label={t("orgstats_2")}
              />
              <FormControlLabel
                value="3"
                control={<Radio />}
                label={t("orgstats_3")}
              />
            </RadioGroup>
          </FormControl>
          <PieChart
            series={[
              {
                data: pieChartData,
              },
            ]}
            width={winWidth / widthDivider}
            height={winHeight / 2.6}
          />
        </Grid>
        <Grid item xs={columnWidth}>
          <h2>{t("userstats_1")}</h2>
          <BarChart
            width={winWidth / widthDivider}
            height={winHeight / 2.6}
            series={allUserStatsData}
            yAxis={[{ data: [""], scaleType: "band", barGapRatio: 0.1 }]}
            layout="horizontal"
            borderRadius={5}
          />
        </Grid>
        <Grid item xs={columnWidth}>
          <h2>{t("userstats_2")}</h2>
          <BarChart
            series={logsPerWeekDayData || []}
            xAxis={[
              {
                scaleType: "band",
                data: [t("monday"), t("tuesday"), t("wednesday"), t("thursday"), t("friday"), t("saturday"), t("sunday")],
              },
            ]}
            width={winWidth / widthDivider}
            height={winHeight / 2.6}
            borderRadius={5}
          />
        </Grid>
        <Grid item xs={columnWidth}>
          <h2>{t("userstats_3")}</h2>
          <LineChart
            series={logTimesData || []}
            width={winWidth / widthDivider}
            height={winHeight / 2.6}
            borderRadius={5}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Statistics;
