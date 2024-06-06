/* istanbul ignore file */
// this file is ignored in the tests because jest doesn't work with the charts
import "../index.css";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import axiosClient from "../axios";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { Grid } from "@mui/material";
import { CSVLink } from "react-csv";
import { getCurrentDateTime } from "../utils/timehelpers";
import Button from "@mui/material/Button";

const API_URL = process.env.API_URL;

const Statistics = () => {
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [orgStatsData, setOrgStatsData] = useState([]);
  const [allUserStatsData, setAllUserStatsData] = useState([]);
  const [CSVdata, setCSVdata] = useState(null);
  const [shouldDownload, setShouldDownload] = useState(false);
  const [minFilter, setMinFilter] = useState("")
  const [maxFilter, setMaxFilter] = useState("")
  const [fetchedData, setFetchedData] = useState(null)
  const [logTimesData, setLogTimesData] = useState(null)
  const [winHeight, setWinHeight] = useState(window.innerHeight)
  const [winWidth, setWinWidth] = useState(window.innerWidth)
  const [columnWidth, setColumnWidth] = useState(6)
  const [widthDivider, setWidthDivider] = useState(2.5)

  useEffect(() => {
    getPermission();
    if (fetchedData) {
      processOrgStats(fetchedData.orgResponse.data, fetchedData.responsibilitiesResponse.data);
      processAllUserStats(fetchedData.userResponse.data, fetchedData.responsibilitiesResponse.data);
    } else if (localStorage.getItem("ACCESS_TOKEN")) {
      fetchData().then(setFetchedData);
    }
    if (window.innerWidth <= window.innerHeight) {
      setColumnWidth(12)
      setWidthDivider(1.2)
    }
  }, []);

  useEffect(() => {
    if (fetchedData) {
      processOrgStats(fetchedData.orgResponse.data, fetchedData.responsibilitiesResponse.data);
      processAllUserStats(fetchedData.userResponse.data, fetchedData.responsibilitiesResponse.data);
    }
  }, [minFilter, maxFilter, fetchedData]);

  useEffect(() => {
    const handleResize = () => {
      setWinWidth(window.innerWidth);
      setWinHeight(window.innerHeight);
      if (window.innerWidth <= window.innerHeight) {
        setColumnWidth(12)
        setWidthDivider(1.2)
      } else {
        setColumnWidth(6)
        setWidthDivider(2.5)
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
    return ((Date.parse(login_time) > Number(Date.parse(minFilter)) && 
    Date.parse(login_time) < Number(Date.parse(maxFilter))) ||
    (Date.parse(logout_time) < Number(Date.parse(maxFilter)) &&
    Date.parse(logout_time) > Number(Date.parse(minFilter))) ||
    (Date.parse(login_time) > Number(Date.parse(minFilter)) &&
    maxFilter === "") ||
    (Date.parse(logout_time) < Number(Date.parse(maxFilter)) &&
    minFilter === "") || (minFilter === "" && maxFilter ==="")
    )  
  }

  const processOrgStats = (orgData, responsibilities) => {
    const orgdata = {};
    orgData.forEach((org) => {
      orgdata[org.name] = { value: 0, label: org.name };
    });
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
  };

  const processAllUserStats = (users, responsibilities) => {
    const userdata = {};
    const logintimesdata = new Array(24).fill(0)
    const logouttimesdata = new Array(24).fill(0)
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
        const hours = new Date(resp.login_time).getHours()
        logintimesdata[hours] += 1
        logouttimesdata[hours] += 1
      }
      }
    });
    Object.values(userdata).forEach((usr) => {
      if (usr.data.reduce((partialSum, a) => partialSum + a, 0) === 0) {
        delete userdata[usr.label];
      }
    });
    const logs = [{data: logintimesdata, label:"Sisäänkirjautuminen", color:'lightGreen'}, {data: logouttimesdata, label:"Uloskirjautuminen", color:'red'}]
    setLogTimesData(logs)
    const realdata = Object.values(userdata);
    realdata.sort(
      (a, b) =>
        parseFloat(b.data.reduce((partialSum, b) => partialSum + b, 0)) -
        parseFloat(a.data.reduce((partialSum, a) => partialSum + a, 0)),
    );
    setAllUserStatsData(realdata);
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
          data.push([
            e.start,
            e.end,
            e.organizer,
            e.title,
            e.description,
            e.responsible,
            e.room,
            e.open,
          ]);
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

  if (userRole === 5 || userRole == null) {
    return <p>Kirjaudu sisään</p>;
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={columnWidth}>
        <div>
        <p>Hae aikavälillä</p>
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
        <div
        style={{float: "right"}}>
        <Button type="button" variant="contained" onClick={handleCSV}>
          Lataa CSV-tiedosto tapahtumista
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
        <h2>YKV-kirjausten määrä järjestöittäin</h2>
        <PieChart
        series={[
        {
          data: orgStatsData,
        },
        ]}
        width={winWidth / widthDivider}
        height={winHeight / 2.5}
        />
        </Grid>
        <Grid item xs={columnWidth}>
        <h2>YKV-kirjausten määrä käyttäjittäin</h2>
        <BarChart
        width={winWidth / widthDivider}
        height={winHeight / 2.5}
        series={allUserStatsData}
        yAxis={[{ data: [""], scaleType: "band", barGapRatio: 0.1 }]}
        layout="horizontal"
        />
        </Grid>
        <Grid item xs={columnWidth}>
        <h2>YKV-kirjausten määrä tunneittain</h2>
        <BarChart
        series={logTimesData || []}
        width={winWidth / widthDivider}
        height={winHeight / 2.5}
        borderRadius={5}
        />
        </Grid>
      </Grid>

    </div>
  );
};

export default Statistics;
