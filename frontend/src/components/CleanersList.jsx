import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";

const CleanersList = ({ allCleaners}) => {
  const columns = [
    { field: "week", headerName: "Viikko", width: 120 },
    { field: "date", headerName: "Pvm", width: 200 },
    { field: "big", headerName: "Iso järjestö", width: 200 },
    { field: "small", headerName: "Pieni järjestö", width: 200 },
  ];

    return (
        <DataGrid
        rows={allCleaners}   /// tänne muokattu
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        />
    );
};

export default CleanersList;