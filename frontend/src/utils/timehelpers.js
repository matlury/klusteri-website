export function getCurrentDateTime() {
  let currentDate = new Date();
  let day = String(currentDate.getDate()).padStart(2, "0");
  let month = String(currentDate.getMonth() + 1).padStart(2, "0");
  let year = String(currentDate.getFullYear());
  let hours = String(currentDate.getHours()).padStart(2, "0");
  let minutes = String(currentDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function formatDatetime(datetimeString) {
  let date = new Date(datetimeString);

  let hours = String(date.getUTCHours()).padStart(2, "0");
  let minutes = String(date.getUTCMinutes()).padStart(2, "0");

  let day = String(date.getUTCDate()).padStart(2, "0");
  let month = String(date.getUTCMonth() + 1).padStart(2, "0");
  let year = String(date.getUTCFullYear());

  return `${hours}:${minutes} | ${day}.${month}.${year}`;
}

export function getTestTimes() {
  let currentDate = new Date();
  let day = String(currentDate.getDate()).padStart(2, "0");
  let month = String(currentDate.getMonth() + 1).padStart(2, "0");
  let year = String(currentDate.getFullYear());
  let hours = String(currentDate.getHours()).padStart(2, "0");
  let hoursadded = parseInt(hours) + 2;
  let paddedHours = hoursadded.toString().padStart(2, '0');
  let minutes = String(currentDate.getMinutes()).padStart(2, "0");

  return [
    `${year}-${month}-${day}T${hours}:${minutes}`,
    `${year}-${month}-${day}T${paddedHours}:${minutes}`,
  ];
}
