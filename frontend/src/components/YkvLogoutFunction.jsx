import React, { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Autocomplete,
} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { lighten, styled } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";

const YkvLogoutFunction = ({
  handleYkvLogin,
  handleYkvLogout,
  idToLogout,
  buttonPopup,
  setButtonPopup,
  activeResponsibilities,
  setIdToLogout,
  loggedUser,
  setEditButtonPopup,
  editButtonPopup,
  setRespToEdit,
  handleYkvEdit,
  responsibility,
  setResponsibility,
  addedResponsibility,
}) => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [search, setSearch] = useState("");
  const [minFilter, setMinFilter] = useState("");
  const [maxFilter, setMaxFilter] = useState("");

  const { t } = useTranslation();

  const handleMaxFilterChange = (event) => {
    setMaxFilter(event.target.value);
  };
  const handleMinFilterChange = (event) => {
    setMinFilter(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const [activeUsers, setActiveUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleRemove = async (id) => {
    await handleYkvLogout(id);
    setActiveUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    setConfirmOpen(false);
  };

  const handleLogoutClick = (id, name) => {
    setSelectedUserId(id);
    setSelectedUserName(name);
    setConfirmOpen(true);
  };

  const getLateIcon = (params) => {
    if (params.row.late) {
      return <AccessTimeIcon />;
    } else if (params.row.present) {
      return <CheckIcon />;
    } else {
      return null;
    }
  };

  const getBackgroundColor = (color) => lighten(color, 0.7);
  const getHoverBackgroundColor = (color) => lighten(color, 0.6);
  const getSelectedBackgroundColor = (color) => lighten(color, 0.5);
  const getSelectedHoverBackgroundColor = (color) => lighten(color, 0.4);

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .late": {
      backgroundColor: getBackgroundColor(theme.palette.error.main),
      transition: "background-color 0.1s ease",
      "&:hover": {
        backgroundColor: getHoverBackgroundColor(theme.palette.error.main),
      },
      "&.Mui-selected": {
        backgroundColor: getSelectedBackgroundColor(theme.palette.error.main),
        "&:hover": {
          backgroundColor: getSelectedHoverBackgroundColor(theme.palette.error.main),
        },
      },
    },
    "& .on-time": {
      backgroundColor: getBackgroundColor(theme.palette.success.main),
      transition: "background-color 0.1s ease",
      "&:hover": {
        backgroundColor: getHoverBackgroundColor(theme.palette.success.main),
      },
      "&.Mui-selected": {
        backgroundColor: getSelectedBackgroundColor(theme.palette.success.main),
        "&:hover": {
          backgroundColor: getSelectedHoverBackgroundColor(theme.palette.success.main),
        },
      },
    },
  }));

  const columns = [
    {
      field: "actions",
      headerName: t("resp_logout"),
      width: 90,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleLogoutClick(params.id, params.row.Vastuussa)}
          id="removeresp"
        >
          <LogoutOutlinedIcon />
        </Button>
      ),
    },
    { field: "Vastuuhenkilö", headerName: t("reservations_resp"), width: 170 },
    { field: "Vastuussa", headerName: t("resp_respfor"), width: 200 },
    { field: "YKV_sisäänkirjaus", headerName: t("resp_login"), width: 200 },
    { field: "Organisaatiot", headerName: t("resp_orgs"), width: 200 },
  ];

  const columns_2 = [
    { field: "Vastuuhenkilö", headerName: t("reservations_resp"), width: 170 },
    { field: "created_by", headerName: t("resp_createdby"), width: 200 },
    { field: "Vastuussa", headerName: t("resp_respfor"), width: 200 },
    { field: "YKV_sisäänkirjaus", headerName: t("resp_login"), width: 200 },
    { field: "logout_time", headerName: t("resp_logout"), width: 200 },
    { field: "Organisaatiot", headerName: t("resp_orgs"), width: 200 },
    { field: "late", headerName: t("resp_act"), width: 200, renderCell: getLateIcon },
  ];

  const fetchResponsibilities = async () => {
    try {
      const res = await axiosClient.get("/listobjects/nightresponsibilities/");
      const userData = res.data.map((u) => ({
        id: u.id, // DataGrid requires a unique 'id' for each row
        Vastuuhenkilö: u.user.username,
        Vastuussa: u.responsible_for,
        YKV_sisäänkirjaus: new Date(u.login_time), // Assuming login_time is available
        Organisaatiot: u.organizations.map((organization) => organization.name), // Assuming login_time is available
        present: u.present,
        created_by: u.created_by,
        logout_time: u.present ? null : new Date(u.logout_time),
        late: u.late,
      }));
      setAllUsers(userData);
      setActiveUsers(userData.filter((resp) => resp.present === true));
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchResponsibilities();
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const email = formJson.email;
    await handleYkvLogin(); // Call handleYkvLogin if needed
    await fetchResponsibilities(); // Fetch responsibilities after login
    handleClose(); // Close the dialog
  };

  function filtering(login_time, logout_time) {
    return (
      (Date.parse(login_time) >= Number(Date.parse(minFilter)) &&
        Date.parse(login_time) <= Number(Date.parse(maxFilter))) ||
      (Date.parse(logout_time) <= Number(Date.parse(maxFilter)) &&
        Date.parse(logout_time) >= Number(Date.parse(minFilter))) ||
      (Date.parse(login_time) >= Number(Date.parse(minFilter)) &&
        maxFilter === "") ||
      (Date.parse(logout_time) <= Number(Date.parse(maxFilter)) &&
        minFilter === "") ||
      (minFilter === "" && maxFilter === "")
    );
  }

  const filteredUsers = allUsers.filter(
    (user) =>
      user.Vastuussa.toLowerCase().includes(search.toLowerCase()) ||
      user.Vastuuhenkilö.toLowerCase().includes(search.toLowerCase()),
    ).filter((user) => filtering(user.YKV_sisäänkirjaus, user.logout_time));

  const ownUsers = allUsers
    .filter(
      (user) =>
        user.Vastuuhenkilö === loggedUser.username ||
        user.created_by === loggedUser.username,
    )
    .filter(
      (user) =>
        user.Vastuussa.toLowerCase().includes(search.toLowerCase()) ||
        user.Vastuuhenkilö.toLowerCase().includes(search.toLowerCase()),
    );

  const getRowClassName = (params) => {
    if (params.row.late) {
      return "late";
    }
    if (params.row.present) {
      return "on-time";
    }
    return "";
  };

  return loading ? (
    <div>{t("loading")}...</div>
  ) : (
    <div style={{ height: 600, width: "100%" }}>
      <h2>{t("ykv_active")}</h2>
      <React.Fragment>
        <Button
          variant="contained"
          className="login-button"
          color="primary"
          onClick={handleClickOpen}
          data-testid="opencreateform"
        >
          + {t("take_resp")}
        </Button>

        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: handleFormSubmit,
          }}
        >
          <DialogTitle>{t("take_resp")}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t("resp_desc")}
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="responsibility"
              type="text"
              label={t("resp_who")}
              value={responsibility}
              fullWidth
              variant="standard"
              onChange={(e) => setResponsibility(e.target.value)}
              data-testid="responsibilityfield"
            />

            <Autocomplete
              id="combo-box-demo"
              options={allUsers}
              getOptionLabel={(option) => option.Vastuuhenkilö}
              style={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("resp_for_other")}
                  variant="standard"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t("cancel")}</Button>
            <Button
              variant="contained"
              type="submit"
              className="create-user-button"
              data-testid="createresponsibility"
              id="takeresp"
            >
              {t("take_resp")}
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>

      <DataGrid
        rows={activeUsers}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
      />

      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>{t("resp_confirm_logout")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("resp_confirm_logout_2")} {selectedUserName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>{t("cancel")}</Button>
          <Button
            onClick={() => handleRemove(selectedUserId)}
            color="primary"
            variant="contained"
            id="confirmlogout"
          >
            {t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
      {loggedUser.role !== 5 && (
        <div>
          <TextField
            label={t("YKVsearch")}
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {loggedUser.role !== 1 && loggedUser.role !== 5 && (
        <div>
          <h2>{t("ownresps")}</h2>
          <StyledDataGrid
            rows={ownUsers}
            columns={columns_2}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            getRowClassName={getRowClassName}
          />
        </div>
      )}

      {loggedUser.role === 1 && (
        <div>
          <h2>{t("allresps")}</h2>
          <div>
            <p>{t("timefilter")}</p>
            <input type="hidden" id="timezone" name="timezone" value="03:00" />
            <input
              value={minFilter}
              onChange={handleMinFilterChange}
              type="datetime-local"
              data-testid="filtermin"
            />
            <input
              value={maxFilter}
              onChange={handleMaxFilterChange}
              type="datetime-local"
              data-testid="filtermax"
            />
          </div>
          <StyledDataGrid
            rows={filteredUsers}
            columns={columns_2}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            getRowClassName={getRowClassName}
          />
        </div>
      )}
    </div>
  );
};

export default YkvLogoutFunction;
