import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";


export default function CleanersListJSONButton({cleaners}) {
    const [cleanersList, setCleanersList] = useState(cleaners);
    const [loading, setLoading] = useState(true);
    
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
        Tuo lista
        </Button>
    );
}