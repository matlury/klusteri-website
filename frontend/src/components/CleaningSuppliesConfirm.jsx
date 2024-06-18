// CleaningSuppliesConfirmDialog.jsx
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const CleaningSuppliesConfirmDialog = ({ open, handleConfirmClose, handleDelete, selectedToolId }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={handleConfirmClose}>
      <DialogTitle>{t("confirm_tool_delete")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("confirm_tool_delete_2")}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirmClose}>{t("cancel")}</Button>
        <Button
          onClick={() => handleDelete(selectedToolId)}
          color="primary"
          variant="contained"
          data-testid="confirmlogout"
          id="confirmremove"
        >
          {t("confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CleaningSuppliesConfirmDialog;