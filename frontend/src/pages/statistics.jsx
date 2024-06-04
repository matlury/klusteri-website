import "../index.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosClient from "../axios";
import { Chart } from "react-google-charts";

const API_URL = process.env.API_URL;

const Statistics = () => {
    const [username, setUsername] = useState(null)
    const [userrole, setUserrole] = useState(null)
    const [orgstatsdata, setorgsstatsdata] = useState([])
    const [allUserStatsData, setAllUserStatsData] = useState([])

    useEffect(() => {
      getPermission();
      if (localStorage.getItem("ACCESS_TOKEN")) {
        getOrgStats();
        getAllUserStats();
      }
    }, [])

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
          setUsername(response.data.username)
          setUserrole(response.data.role)
        });
      }
    };

    const getOrgStats = async () => {
      const resp = await axiosClient.get('listobjects/organizations/').catch((error) => {
        console.error("Error fetching organizations", error);
      });
      const orgdata = {}
      resp.data.forEach(org => {
        orgdata[org.name] = [org.name, 0]
      });
      const response = await axiosClient.get(`listobjects/nightresponsibilities/`).catch((error) => {
          console.error("Error fetching responsibilities", error);
        });
      const responsibilities = response.data
      responsibilities.forEach(resp => {
        resp.organizations.forEach(org => {
            orgdata[org.name][1] += 1
        })
      })
      const realdata = Object.values(orgdata)
      realdata.unshift(["ORG", "YKV"])

      setorgsstatsdata(realdata)
    }

    const getAllUserStats = async () => {
      const resp = await axiosClient.get('listobjects/users/').catch((error) => {
          console.error("Error fetching users", error);
        });
      const users = resp.data
      const userdata = {}
      users.forEach(usr => {
        userdata[usr.username] = [usr.username, 0]
      });
      const response = await axiosClient.get(`listobjects/nightresponsibilities/`).catch((error) => {
          console.error("Error fetching responsibilities", error);
        });
      const responsibilities = response.data
      responsibilities.forEach(resp => {
        userdata[resp.user.username][1] += 1
      })
      Object.values(userdata).forEach(usr => {
        if (usr[1] === 0) {
            delete userdata[usr[0]]
        }
      })
      const realdata = Object.values(userdata)
      realdata.sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));
      realdata.unshift(["PERSON", "YKV"])
      setAllUserStatsData(realdata)
    }

    const options = {legend: { position: "none" }}

    if (userrole === 5 || userrole == null) {
        return ( <p>Kirjaudu sisään</p> )
    }

    return(
    <div>
      <h2>YKV-kirjausten määrä järjestöittäin</h2>
      <Chart
        chartType="PieChart"
        data={orgstatsdata}
        width="100%"
        height="25em"
      />
      <h2>YKV-kirjausten määrä käyttäjittäin</h2>
      <Chart
        chartType="BarChart"
        width="100%"
        height="25em"
        data={allUserStatsData}
        options={options}
      />
    </div>
    )
}

export default Statistics