import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosClient from "../axios";
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';

const API_URL = process.env.API_URL;

const Statistics = () => {
    const [username, setUsername] = useState(null)
    const [userrole, setUserrole] = useState(null)
    const [orgstatsdata, setorgsstatsdata] = useState([])
    const [allUserStatsData, setAllUserStatsData] = useState([])

    useEffect(() => {
      getPermission();
      getOrgStats();
      getAllUserStats();
    }, [])

    const getPermission = async () => {
      const accessToken = localStorage.getItem("ACCESS_TOKEN");
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
    };

    const getOrgStats = async () => {
      const resp = await axiosClient.get('listobjects/organizations/').catch((error) => {
        console.error("Error fetching organizations", error);
      });
      const orgdata = {}
      resp.data.forEach(org => {
        orgdata[org.name] = {value: 0, label: org.name }
      });
      const response = await axiosClient.get(`listobjects/nightresponsibilities/`).catch((error) => {
          console.error("Error fetching responsibilities", error);
        });
      const responsibilities = response.data
      responsibilities.forEach(resp => {
        resp.organizations.forEach(org => {
            orgdata[org.name] = {...orgdata[org.name], value: orgdata[org.name].value + 1}
        })
      })
      const realdata = Object.values(orgdata)

      setorgsstatsdata(realdata)
    }

    const getAllUserStats = async () => {
      const resp = await axiosClient.get('listobjects/users/').catch((error) => {
          console.error("Error fetching users", error);
        });
      const users = resp.data
      const userdata = {}
      users.forEach(usr => {
        userdata[usr.username] = {data: [0], label: usr.username }
      });
      const response = await axiosClient.get(`listobjects/nightresponsibilities/`).catch((error) => {
          console.error("Error fetching responsibilities", error);
        });
      const responsibilities = response.data
      responsibilities.forEach(resp => {
        userdata[resp.user.username] = {...userdata[resp.user.username], data: [userdata[resp.user.username].data[0] + 1]}
      })
      Object.values(userdata).forEach(usr => {
        if (usr.data.reduce((partialSum, a) => partialSum + a, 0) === 0) {
            delete userdata[usr.label]
        }
      })
      const realdata = Object.values(userdata)
      realdata.sort((a, b) => parseFloat(b.data.reduce((partialSum, b) => partialSum + b, 0)) - parseFloat(a.data.reduce((partialSum, a) => partialSum + a, 0)))
      setAllUserStatsData(realdata)
    }

    if (userrole === 5 || userrole === null) {
        return ( <p>Kirjaudu sisään</p> )
    }

    return(<div>
        <h2>YKV-kirjausten määrä järjestöittäin</h2>
        <PieChart
        series={[
        {
      data: orgstatsdata,
        },
        ]}
        width={400}
        height={200}
        />
        <h2>YKV-kirjausten määrä käyttäjittäin</h2>
        <BarChart 
              width={500}
              height={300}
              series={allUserStatsData}
              xAxis={[{ data: ["Käyttäjät"], scaleType: 'band' }]}
        />
        </div>
    )
}

export default Statistics