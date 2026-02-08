import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Box,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import RestoreIcon from '@mui/icons-material/Restore';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { organizationsAPI, usersAPI, keysAPI } from "../api/api.ts";
import { Role } from "../roles.js";


const OrganisationPage = ({
  organizations,
  allUsers,
  hasPermissionOrg,
  handleOrganizationDetails,
  handleDeleteOrganization,
  fetchOrganizations,
  currentUserRole,
}) => {

  const [open, setOpen] = useState(false);

  const [organisation_new_name, setOrganisationNewName] = useState("");
  const [organisation_new_homepage, setOrganisationNewHomePage] = useState("");
  const [organisation_new_email, setOrganisationNewEmail] = useState("");
  const [organisation_new_color, setOrganizationNewColor] = useState("");
  const [organisation_id, setOrganisationId] = useState("");
  const [keyholders, setKeyholders] = useState([]);
  const [selectedUserToAdd, setSelectedUserToAdd] = useState(null);

  const [pendingRemovals, setPendingRemovals] = useState(new Set());
  const [pendingAdditions, setPendingAdditions] = useState([]);
  const [pendingResRights, setPendingResRights] = useState(new Map()); // userId -> boolean

  const { t } = useTranslation();

  const canManageResRights = [
    Role.LEPPISPJ,
    Role.LEPPISVARAPJ,
    Role.JARJESTOPJ,
    Role.JARJESTOVARAPJ
  ].includes(currentUserRole);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setKeyholders([]);
    setSelectedUserToAdd(null);
    setPendingRemovals(new Set());
    setPendingAdditions([]);
    setPendingResRights(new Map());
  };

  const toggleOrgDetails = async (orgId) => {
    const showThisOrg = organizations.find((org) => org.id === orgId);
    setOrganisationNewName(showThisOrg.Organisaatio)
    setOrganisationNewHomePage(showThisOrg.kotisivu)
    setOrganisationNewEmail(showThisOrg.email)
    setOrganizationNewColor(showThisOrg.color)
    setOrganisationId(showThisOrg.id)
    try {
      const response = await organizationsAPI.getOrganization(orgId);
      setKeyholders(response.data.user_set || []);
    } catch (error) {
      console.error("Error fetching keyholders:", error);
    }

    handleClickOpen();
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    let confirmMessage = t("orgeditconfirm") || "Are you sure you want to update this organization?";

    const removalNames = keyholders
      .filter(kh => pendingRemovals.has(kh.id))
      .map(kh => kh.username);

    const additionNames = pendingAdditions.map(pa => pa.username);

    const resRightsChanges = [];
    pendingResRights.forEach((newValue, userId) => {
      const user = keyholders.find(kh => kh.id === userId) || pendingAdditions.find(pa => pa.id === userId);
      if (user && user.rights_for_reservation !== newValue) {
        resRightsChanges.push({
          username: user.username,
          added: newValue
        });
      }
    });

    if (removalNames.length > 0 || additionNames.length > 0 || resRightsChanges.length > 0) {
      confirmMessage += "\n\n" + (t("pending_changes") || "Pending changes:");
      if (removalNames.length > 0) {
        confirmMessage += `\n- ${t("removing_keys") || "Removing keys"}: ${removalNames.join(", ")}`;
      }
      if (additionNames.length > 0) {
        confirmMessage += `\n- ${t("adding_keys") || "Adding keys"}: ${additionNames.join(", ")}`;
      }
      if (resRightsChanges.length > 0) {
        resRightsChanges.forEach(change => {
          confirmMessage += `\n- ${change.username}: ${change.added ? t("addresrights") : t("removeresrights")}`;
        });
      }
    }

    if (window.confirm(confirmMessage)) {
      try {
        // 1. Update Org Info
        await handleOrganizationDetails(organisation_new_name, organisation_new_email, organisation_new_homepage, organisation_new_color, organisation_id);

        // 2. Handle Removals
        for (const userId of pendingRemovals) {
          const userToUpdate = allUsers.find(u => u.id === userId);
          if (userToUpdate) {
            const currentMemberships = userToUpdate.memberships || [];
            const updatedMemberships = currentMemberships.filter(name => name !== organisation_new_name);
            const updatedKeys = organizations
              .filter(org => updatedMemberships.includes(org.Organisaatio))
              .map(org => org.id);
            await usersAPI.updateUser(userId, { keys: updatedKeys });
          }
        }

        // 3. Handle Additions
        for (const user of pendingAdditions) {
          await keysAPI.handOverKey(user.id, {
            organization_name: organisation_new_name,
          });
          // If res rights were also changed for this new user, we'll handle it in step 4
        }

        // 4. Handle Reservation Rights changes
        for (const [userId, newValue] of pendingResRights.entries()) {
          // Avoid double updating if user was removed
          if (!pendingRemovals.has(userId)) {
            await usersAPI.updateUser(userId, { rights_for_reservation: newValue });
          }
        }

        await fetchOrganizations();
        handleClose();
      } catch (error) {
        console.error("Error saving organization changes:", error);
      }
    }
  };

  const handleDelete = async (organisation_id) => {
    await handleDeleteOrganization(organisation_id);
    await fetchOrganizations();
    handleClose();
  }

  const handleToggleRemoveKeyholder = (userId) => {
    setPendingRemovals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleToggleResRights = (userId, currentValue) => {
    setPendingResRights(prev => {
      const newMap = new Map(prev);
      const pendingValue = newMap.has(userId) ? newMap.get(userId) : currentValue;
      newMap.set(userId, !pendingValue);
      return newMap;
    });
  };

  const handleAddKeyholder = () => {
    if (!selectedUserToAdd) return;
    if (keyholders.some(kh => kh.id === selectedUserToAdd.id)) return;
    if (pendingAdditions.some(pa => pa.id === selectedUserToAdd.id)) return;

    setPendingAdditions(prev => [...prev, selectedUserToAdd]);
    setSelectedUserToAdd(null);
  };

  const handleRemovePendingAddition = (userId) => {
    setPendingAdditions(prev => prev.filter(pa => pa.id !== userId));
    setPendingResRights(prev => {
      const newMap = new Map(prev);
      newMap.delete(userId);
      return newMap;
    });
  };

  const columns = [
    {
      field: "actions",
      headerName: t("edit"),
      width: 200,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          className="modify_org"
          id="modify_org"
          onClick={() => toggleOrgDetails(params.id)}
        >
          <EditOutlinedIcon />
        </Button>
      ),
    },
    { field: "Organisaatio", headerName: t("name"), width: 150 },
    { field: "kotisivu", headerName: t("homepage"), width: 200 },
    { field: "email", headerName: t("email"), width: 200 },
    { field: "Avaimia", headerName: t("keys"), width: 80 },
  ];

  return (
    <div>
      <h2>{t("resp_orgs")}</h2>
      <div>
        <DataGrid
          rows={organizations}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>
      {hasPermissionOrg === true && (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{t("editorg")}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 1 }}>
              <TextField
                label={t("name")}
                id="organization_name"
                value={organisation_new_name}
                onChange={(e) => setOrganisationNewName(e.target.value)}
                fullWidth
                sx={{ marginBottom: '1rem' }}
              />
              <TextField
                label={t("email")}
                id="organization_new_email"
                value={organisation_new_email}
                onChange={(e) => setOrganisationNewEmail(e.target.value)}
                fullWidth
                sx={{ marginBottom: '1rem' }}
              />
              <TextField
                label={t("homepage")}
                id="organization_homepage"
                value={organisation_new_homepage}
                onChange={(e) => setOrganisationNewHomePage(e.target.value)}
                fullWidth
                sx={{ marginBottom: '1rem' }}
              />
              <TextField
                label={t("color")}
                id="organization_new_color"
                value={organisation_new_color}
                onChange={(e) => setOrganizationNewColor(e.target.value)}
                fullWidth
                sx={{ marginBottom: '1rem' }}
              />

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                {t("keys")}
              </Typography>

              <List dense>
                {/* Current keyholders */}
                {keyholders.map((user) => {
                  const isPendingRemoval = pendingRemovals.has(user.id);
                  const hasResRights = pendingResRights.has(user.id)
                    ? pendingResRights.get(user.id)
                    : user.rights_for_reservation;
                  const resRightsChanged = pendingResRights.has(user.id) && pendingResRights.get(user.id) !== user.rights_for_reservation;

                  return (
                    <ListItem key={user.id} sx={{ bgcolor: isPendingRemoval ? 'rgba(255, 0, 0, 0.1)' : 'transparent' }}>
                      <ListItemText
                        primary={user.username}
                        secondary={user.email}
                        primaryTypographyProps={{
                          sx: {
                            color: isPendingRemoval ? 'error.main' : 'inherit',
                            textDecoration: isPendingRemoval ? 'line-through' : 'none'
                          }
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title={hasResRights ? t("removeresrights") : t("addresrights")}>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleResRights(user.id, user.rights_for_reservation)}
                            disabled={isPendingRemoval || !canManageResRights}
                            color={resRightsChanged ? "primary" : "default"}
                          >
                            {hasResRights ? <EventAvailableIcon color="success" /> : <EventBusyIcon color="error" />}
                          </IconButton>
                        </Tooltip>
                        <IconButton edge="end" onClick={() => handleToggleRemoveKeyholder(user.id)}>
                          {isPendingRemoval ? <RestoreIcon /> : <ClearIcon />}
                        </IconButton>
                      </Box>
                    </ListItem>
                  );
                })}

                {/* Pending additions */}
                {pendingAdditions.map((user) => {
                  const hasResRights = pendingResRights.has(user.id)
                    ? pendingResRights.get(user.id)
                    : user.rights_for_reservation;

                  return (
                    <ListItem key={user.id} sx={{ bgcolor: 'rgba(0, 255, 0, 0.1)' }}>
                      <ListItemText
                        primary={user.username}
                        secondary={user.email}
                        primaryTypographyProps={{ sx: { color: 'success.main' } }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title={hasResRights ? t("removeresrights") : t("addresrights")}>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleResRights(user.id, user.rights_for_reservation)}
                            disabled={!canManageResRights}
                          >
                            {hasResRights ? <EventAvailableIcon color="success" /> : <EventBusyIcon color="error" />}
                          </IconButton>
                        </Tooltip>
                        <IconButton edge="end" onClick={() => handleRemovePendingAddition(user.id)}>
                          <ClearIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                  );
                })}

                {keyholders.length === 0 && pendingAdditions.length === 0 && (
                  <Typography variant="body2" color="textSecondary">
                    {t("no_keyholders") || "No keyholders found."}
                  </Typography>
                )}
              </List>

              <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center' }}>
                <Autocomplete
                  id="user-add-autocomplete"
                  options={allUsers.filter(u =>
                    !keyholders.some(kh => kh.id === u.id) &&
                    !pendingAdditions.some(pa => pa.id === u.id)
                  )}
                  getOptionLabel={(option) => option.username}
                  value={selectedUserToAdd}
                  onChange={(event, newValue) => {
                    setSelectedUserToAdd(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t("chooseuser") || "Choose user"} size="small" />
                  )}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddKeyholder}
                  disabled={!selectedUserToAdd}
                >
                  {t("add") || "Add"}
                </Button>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{ backgroundColor: 'red', color: 'white' }}
              className="delete-org-button"
              onClick={() => handleDelete(organisation_id)}
            >
              <DeleteIcon /> {t("delete")}
            </Button>
            <div style={{ flexGrow: 1 }} />
            <Button onClick={handleClose}>{t("cancel")}</Button>
            <Button
              variant="contained"
              color="primary"
              id="confirm_org_change"
              className="confirm_org_change"
              onClick={handleFormSubmit}
            >
              {t("confirmchanges")}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  )
};


export default OrganisationPage;