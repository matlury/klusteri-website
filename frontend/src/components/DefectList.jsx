// DefectList.jsx
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";

const DefectList = ({ loggedUser, allDefects, activeDefects, handleRepairClick, handleEmailClick }) => {
  const { t } = useTranslation();
  
  const columns = [
    { field: "description", headerName: t("desc"), width: 400 },
    { field: "time", headerName: t("time"), width: 200 },
    { field: "email", headerName: t("emailsent"), width: 200 },
    {
      field: "email_button",
      headerName: t("marksent"),
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
    { field: "repaired", headerName: t("fixed"), width: 200 },
    {
      field: "actions",
      headerName: t("fix"),
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