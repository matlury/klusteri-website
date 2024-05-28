import React, { Component } from "react";
import axiosClient from "../axios.js";
import { DataGrid } from '@mui/x-data-grid';
import { Button } from "@mui/material";


class YkvLogoutFunction extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      loading: true,
    };

    this.columns = [
      { field: 'Vastuuhenkilö', headerName: 'Vastuuhenkilö', width: 200 },
      { field: 'Vastuussa', headerName: 'Vastuussa', width: 300 },
      { field: 'YKV_sisäänkirjaus', headerName: 'YKV sisäänkirjaus', width: 200 },
    ];
  }

  componentDidMount() {
    axiosClient
      .get("/listobjects/nightresponsibilities/")
      .then((res) => {
        const userData = res.data.map((u, index) => ({
          id: index, // DataGrid requires a unique 'id' for each row
          Vastuuhenkilö: u.username,
          Vastuussa: u.responsible_for,
          YKV_sisäänkirjaus: u.login_time, // Assuming login_time is available
        }));
        this.setState({
          users: userData,
          loading: false,
        });
      })
      .catch((error) => console.error(error));
  }

  render() {
    return this.state.loading ? (
      <div>Lataa...</div>
    ) : (
      
      <div style={{ height: 400, width: '100%' }}>
        <h2>Aktiiviset</h2>
        <Button
        variant="contained"
        className="login-button"
        color="primary"
        type="submit"
        >
          + Ota vastuu
        </Button>
        

        <DataGrid
          rows={this.state.users}
          columns={this.columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection={true}
        />
      </div>
    );
  }
}

export default YkvLogoutFunction;