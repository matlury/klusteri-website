import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

function CountdownTimer({ onExpire, onExtend }) {
  const initialTime =
    parseInt(localStorage.getItem("countdownTime"), 10) || 30 * 60; // 30 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [intervalId, setIntervalId] = useState(null); // State to hold the interval ID
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft === 0) {
          clearInterval(id);
          onExpire(); // Trigger logout when timer expires
          return 0;
        }
        if (prevTimeLeft === 5 * 60) { // 5 minutes in seconds
          setIsDialogOpen(true); // Open the dialog 5 minutes before timeout
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    setIntervalId(id);

    return () => {
      clearInterval(id);
    };
  }, [onExpire]);

  useEffect(() => {
    localStorage.setItem("countdownTime", timeLeft.toString());
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleExtend = () => {
    setTimeLeft(30 * 60); // Reset timer to 30 minutes
    setIsDialogOpen(false); // Close the dialog
    onExtend(); // Notify parent component that the session was extended
  };

  const handleSignOut = () => {
    clearInterval(intervalId); // Stop the timer
    onExpire(); // Trigger logout
  };

  return (
    <div>
      {formatTime(timeLeft)}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Automaattinen uloskirjaus</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Kirjaamme sinut ulos automaattisesti 5 minuutin kuluttua. Haluatko jatkaa istuntoasi?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSignOut} color="primary">
            Kirjaudu ulos
          </Button>
          <Button onClick={handleExtend} color="primary" autoFocus>
            Jatka istuntoa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CountdownTimer;
