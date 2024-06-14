/* istanbul ignore file */
// this file is ignored in the tests because jest doesn't work with uploading data

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const EmptyCleaners = ({ confirm, handleCloseConfirm, handleRemoveFormSubmit }) => {

  const onSubmit = (event) => {
    event.preventDefault();
    handleRemoveFormSubmit();
    handleCloseConfirm();
  };

  const { t } = useTranslation();

  return (
  <Dialog
    open={confirm}
    onClose={handleCloseConfirm}
    PaperProps={{
      component: "form",
      onSubmit: onSubmit,
    }}
>
      <DialogTitle>{t("cleaningclearconfirm")} </DialogTitle>
      <DialogActions>
        <Button onClick={handleCloseConfirm}>{t("cancel")}</Button>
        <Button 
          type="submit" 
          data-testid="delete-cleaninglist"
          id="delete-cleaninglist"
          className="delete-cleaninglist-button"
          >
          {t("clear")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmptyCleaners;