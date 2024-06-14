/* istanbul ignore file */
// this file is ignored in the tests because jest doesn't work with uploading data

import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useTranslation } from "react-i18next";


export default function CleanersListJSONButton({cleaners}) {
    const [cleanersList, setCleanersList] = useState(cleaners);
    const [loading, setLoading] = useState(true);

    const { t } = useTranslation();
    
    useEffect(() => {
        setCleanersList(cleaners);
        setLoading(false);
    }, [cleaners]);
    
    const downloadCleanersList = () => {
        const url = "/listobjects/cleaning/";
        const fileName = "siivousvuorot.json";
        const json = JSON.stringify(cleanersList);
        const blob = new Blob([json], { type: "application/json" });
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
        <Button
        variant="contained"
        color="primary"
        startIcon={<DownloadIcon />}
        onClick={downloadCleanersList}
        disabled={loading}
        >
        {t("cleaningexportlist")}
        </Button>
    );
}