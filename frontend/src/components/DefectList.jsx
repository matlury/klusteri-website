// DefectList.jsx
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const DefectList = ({ loggedUser, allDefects, activeDefects, handleRepairClick, handleEmailClick }) => {
  const columns = [
    { field: "description", headerName: "Kuvaus", width: 400 },
    { field: "time", headerName: "Aika", width: 200 },
    { field: "email", headerName: "Sähköposti lähetetty", width: 200 },
    {
      field: "email_button",
      headerName: "Merkitse lähetetyksi",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleEmailClick(params.id)}
          data-testid={`email-button-${params.id}`}
          id="emailfault"
        >
          <CheckIcon />
        </Button>
      ),
    },
    { field: "repaired", headerName: "Korjattu", width: 200 },
    {
      field: "actions",
      headerName: "Korjaa",
      width: 90,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleRepairClick(params.id)}
          data-testid={`repair-button-${params.id}`}
          id="repairfault"
        >
          <CheckIcon />
        </Button>
      ),
    },
  ];

  const columns_buttonless = [
    { field: "description", headerName: "Kuvaus", width: 400 },
    { field: "time", headerName: "Aika", width: 200 },
  ];

  if (loggedUser && loggedUser.role === 1) {
    return (
      <DataGrid
        rows={allDefects}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
      />
    );
  } else {
    return (
      <DataGrid
        rows={activeDefects}
        columns={columns_buttonless}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
      />
    );
  }
};

export default DefectList;