import React, { useState, useEffect } from 'react';

// countdown timer for automatic logout (30 minutes), because access tokens are only valid for 30 minutes
function CountdownTimer({ onExpire }) {
  const initialTime = parseInt(localStorage.getItem('countdownTime'), 10) || 30 * 60; // Read initial time from local storage
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [intervalId, setIntervalId] = useState(null); // State to hold the interval ID

  useEffect(() => {
    // Timer logic to decrement timeLeft every second
    const id = setInterval(() => {
      setTimeLeft(prevTimeLeft => {
        if (prevTimeLeft === 0) {
          clearInterval(id);
          onExpire(); // Trigger logout when timer expires
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    // Save the interval ID to state
    setIntervalId(id);

    return () => {
      clearInterval(intervalId); // Clear the interval on component unmount
    };
  }, [onExpire]);

  // Save remaining time to local storage every time it changes
  useEffect(() => {
    localStorage.setItem('countdownTime', timeLeft.toString());
  }, [timeLeft]);

  // Convert seconds to MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return <div>{formatTime(timeLeft)}</div>;
}

export default CountdownTimer;
