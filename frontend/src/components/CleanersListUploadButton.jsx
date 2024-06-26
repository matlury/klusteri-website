/* istanbul ignore file */
// this file is ignored in the tests because jest doesn't work with uploading data

import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { useTranslation } from "react-i18next";

export default function CleanersListUploadButton({ setNewData }) {
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      const data = JSON.parse(content);
      setNewData(data);
    };

    reader.readAsText(file);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      component="label"
      startIcon={<UploadIcon />}
      disabled={loading}
    >
      {t("cleaningimportlist")}
      <input
        type="file"
        accept=".json"
        hidden
        onChange={handleFileUpload}
      />
    </Button>
  );
}