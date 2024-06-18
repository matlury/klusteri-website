import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { useTranslation } from "react-i18next";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';


const CleaningSuppliesList = ({ loggedUser, allCleaningSupplies, handleDeleteClick}) => {
    const { t } = useTranslation();
    
    const columns = [
      { field: "tool", headerName: t("cleaningtool"), width: 150 },
      {
        field: "delete",
        headerName: t("delete"),
        width: 90,
        renderCell: (params) => (
          <Button
            variant="outlined"
            onClick={() => handleDeleteClick(params.id)}
            data-testid={`delete-tool-button-${params.id}`}
            id="delete-tool"
          >
            <DeleteIcon />
          </Button>
        ),
      },
    ];
  
    const columns_buttonless = [
      { field: "tool", headerName: t("cleaningtool"), width: 400 },
    ];
  
    if (loggedUser && loggedUser.role === 1) {
      return (
        <DataGrid
          rows={allCleaningSupplies}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      );
    } else {
      return (
        <DataGrid
          rows={allCleaningSupplies}
          columns={columns_buttonless}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      );
    }
  };
  
  export default CleaningSuppliesList;
