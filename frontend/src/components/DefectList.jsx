// DefectList.jsx
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const DefectList = ({ allDefects, handleLogoutClick }) => {
  const columns = [
    { field: "description", headerName: "Kuvaus", width: 400 },
    { field: "time", headerName: "Aika", width: 200 },
    { field: "email", headerName: "Sähköposti lähetetty", width: 200 },
    { field: "repaired", headerName: "Korjattu", width: 200 },
    {
      field: "actions",
      headerName: "Korjaa",
      width: 90,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleLogoutClick(params.id)}
          data-testid={`repair-button-${params.id}`}
        >
          <CheckIcon />
        </Button>
      ),
    },
  ];

  return <DataGrid rows={allDefects} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]} />;
};

export default DefectList;
