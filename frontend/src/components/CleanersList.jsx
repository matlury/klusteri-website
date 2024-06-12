import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import moment from "moment";

const CleanersList = ({ allCleaners}) => {
  const columns = [
    { field: "week", headerName: "Viikko", width: 120 },
    { field: "date", headerName: "Pvm", width: 200 },
    { field: "big", headerName: "Iso järjestö", width: 120 },
    { field: "small", headerName: "Pieni järjestö", width: 120 },
  ];

  const today = moment();

  const getRowClassName = (params) => {
    const rowDate = moment(params.row.date);
    return rowDate.isBefore(today, "day") ? "past-week" : "";
  };

  return (
    <StyledDataGrid
      initialState={{
        sorting: {
          sortModel: [{ field: "week", sort: "asc" }],
        },
      }}
      rows={allCleaners}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5, 10, 20]}
      getRowClassName={getRowClassName}
    />
  );
};

export default CleanersList;
