import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const CleanersList = ({ allCleaners}) => {
  const columns = [
    { field: "vko", headerName: "Viikko", width: 120 },
    { field: "pvm", headerName: "Pvm", width: 120 },
    { field: "isojarj", headerName: "Iso järjestö", width: 200 },
    { fiel: "pienijarj", headerName: "Pieni järjestö", width: 200 },
  ];

    return (
        <DataGrid
        rows={allCleaners}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        />
    );
};

export default CleanersList;