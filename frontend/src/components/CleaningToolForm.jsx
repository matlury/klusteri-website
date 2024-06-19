// CleaningToolFOrm.jsx
import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const CleaningToolForm = ({ open, handleClose, handleFormSubmit }) => {
  const [description, setDescription] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    handleFormSubmit(description);
    setDescription("");
    handleClose();
  };

  const { t } = useTranslation();

  return (
  <Dialog
    open={open}
    onClose={handleClose}
    PaperProps={{
      component: "form",
      onSubmit: onSubmit,
    }}
>
      <DialogTitle>{t("givetool")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("givetool_desc")}</DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          data-testid="description"
          id="description"
          value={description}
          type="text"
          label={t("tool_desc")}
          fullWidth
          variant="standard"
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("cancel")}</Button>
        <Button 
          variant="contained"
          type="submit" 
          data-testid="createtool"
          id="addtool"
          >
          {t("save_tool")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CleaningToolForm;
