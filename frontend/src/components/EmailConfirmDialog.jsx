// RepairConfirmDialog.jsx
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

const EmailConfirmDialog = ({ open, handleConfirmClose, handleMarkEmailSent, selectedDefectId }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={handleConfirmClose}>
      <DialogTitle>{t("confirm_defect_email")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("confirm_defect_email_2")}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirmClose}>{t("cancel")}</Button>
        <Button
          onClick={() => handleMarkEmailSent(selectedDefectId)}
          color="primary"
          variant="contained"
          data-testid="confirmlogout"
          id="confirmemail"
        >
          {t("confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailConfirmDialog;
