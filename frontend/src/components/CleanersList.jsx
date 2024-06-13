import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { lighten, styled } from '@mui/material/styles';
import moment from "moment";


const CleanersList = ({ allCleaners }) => {
  const getBackgroundColor = (color) =>
    lighten(color, 0.4);
  
  const getHoverBackgroundColor = (color) =>
    lighten(color, 0.2);

  const getSelectedBackgroundColor = (color) =>
    lighten(color, 0.1);
  
  const getSelectedHoverBackgroundColor = (color) =>
    lighten(color, 0.1);

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .past-week": {
      backgroundColor: getBackgroundColor(theme.palette.grey[300]),
      transition: 'background-color 0.1s ease',
      '&:hover': {
        backgroundColor: getHoverBackgroundColor(theme.palette.grey[300]),
      },
      '&.Mui-selected': {
        backgroundColor: getSelectedBackgroundColor(theme.palette.grey[300]),
        '&:hover': {
          backgroundColor: theme.palette.grey[300],
        },
      },
    },
  }));

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
        initialState={{sorting:{sortModel:[{field:'week', sort:'asc'}],
          },}}
        rows={allCleaners}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        getRowClassName={getRowClassName}
        />
    );
};

export default CleanersList;