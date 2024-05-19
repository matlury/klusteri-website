import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import { formatDatetime } from "../utils/timehelpers";

const ReservationsView = ({
  handleAddNewEventClick,
  handleSelectSlot,
  handleSelectEvent,
  showCreateModal,
  handleCloseModal,
  handleInputChange,
  eventDetails,
  handleAddEvent,
  showInfoModal,
  activeResponsibilities,
  localizer,
  events,
  startRef,
  endRef,
  selectedEvent,
  handleDeleteEvent,
  moment,
}) => {
  return (
    <div className="textbox">
      <h1>Varauskalenteri</h1>
      <div className="add-event-button">
        <Button
          id="createEvent"
          variant="primary"
          onClick={handleAddNewEventClick}
          style={{
            backgroundColor: "gray",
            borderColor: "gray",
            padding: "7px",
            margin: "10px",
          }}
        >
          Lisää uusi tapahtuma
        </Button>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        firstDay={1}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.open === true ? "#4caf50" : "#F08080",
            borderRadius: "5px",
            border: "none",
            color: "#fff",
            padding: "5px",
            margin: "0 3px",
            cursor: "pointer",
          },
        })}
      />

      <Modal show={showCreateModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{"Lisää tapahtuma"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>Varauksen tiedot:</p>
            <p style={{ color: "grey" }}>
              Voit tehdä enimmillään 24 tunnin varauksen.
            </p>
            <p>
              Alkaa:{" "}
              <input
                id="startTime"
                type="datetime-local"
                name="start"
                ref={startRef}
                onChange={handleInputChange}
              />
            </p>
            <p>
              Päättyy:{" "}
              <input
                id="endTime"
                type="datetime-local"
                name="end"
                ref={endRef}
                onChange={handleInputChange}
              />
            </p>
            <p style={{ color: "red" }}>
              Huomioithan yökäyttösäännöt klo 00-08.
            </p>
            <input
              id="eventName"
              name="title"
              placeholder="Tapahtuman nimi"
              value={eventDetails.title}
              onChange={handleInputChange}
              style={{ width: "100%", borderRadius: "5px" }}
            />
            <p></p>
            <input
              id="organizerName"
              name="organizer"
              placeholder="Järjestäjä"
              value={eventDetails.organizer}
              onChange={handleInputChange}
              style={{ width: "100%", borderRadius: "5px" }}
            />
            <p></p>
            <input
              id="responsibleName"
              name="responsible"
              placeholder="Vastuuhenkilö"
              value={eventDetails.responsible}
              onChange={handleInputChange}
              style={{ width: "100%", borderRadius: "5px" }}
            />
            <p></p>

            <textarea
              id="eventDescription"
              name="description"
              placeholder="Tapahtuman kuvaus"
              value={eventDetails.description}
              onChange={handleInputChange}
              style={{ width: "100%", height: "100px", borderRadius: "5px" }}
            />
            <select
              id="eventOpen"
              name="isOpen"
              value={eventDetails.isOpen}
              onChange={handleInputChange}
            >
              <option value="tyhjä">Valitse avoimuus</option>
              <option value="avoin">Avoin tapahtuma</option>
              <option value="suljettu">Vain jäsenille</option>
            </select>
            <select
              id="eventRoom"
              name="room"
              value={eventDetails.room}
              onChange={handleInputChange}
            >
              <option value="tyhjä">Valitse huone</option>
              <option value="Kokoushuone">Kokoushuone</option>
              <option value="Kerhotila">Kerhotila</option>
              <option value="Oleskelutila">Oleskelutila</option>
              <option value="ChristinaRegina">ChristinaRegina</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Sulje
          </Button>
          <Button id="confirmCreate" variant="primary" onClick={handleAddEvent}>
            Tallenna
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showInfoModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent ? selectedEvent.title : ""}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <>
              <p>
                Alkaa: {moment(selectedEvent.start).format("YYYY-MM-DD HH:mm")}
              </p>
              <p>
                Päättyy: {moment(selectedEvent.end).format("YYYY-MM-DD HH:mm")}
              </p>
              <p>Järjestäjä: {selectedEvent.organizer}</p>
              <p>Vastuuhenkilö: {selectedEvent.responsible}</p>
              <p>Kuvaus: {selectedEvent.description}</p>
              <p>Tila: {selectedEvent.open === true ? "Avoin" : "Suljettu"}</p>
              <p>Huone: {selectedEvent.room}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            id="deleteEvent"
            variant="danger"
            onClick={() => handleDeleteEvent(selectedEvent.id)}
          >
            Poista tapahtuma
          </Button>
          <Button
            id="closeEvent"
            variant="secondary"
            onClick={handleCloseModal}
          >
            Sulje
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="textbox_list_of_active_responsibilities">
        <h4>Aktiiviset YKV-kirjaukset</h4>
        {activeResponsibilities.length > 0 ? (
          <div className="ykvtab">
            <table className="ykvtable">
              <thead>
                <tr>
                  <th>Käyttäjänimi</th>
                  <th>Vastuualue</th>
                  <th>Kirjautumisaika</th>
                </tr>
              </thead>
              <tbody>
                {activeResponsibilities.map((responsibility, index) => (
                  <tr key={index}>
                    <td>{responsibility.username}</td>
                    <td>{responsibility.responsible_for}</td>
                    <td>{formatDatetime(responsibility.login_time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Ei aktiivisia YKV-kirjauksia</p>
        )}
      </div>
    </div>
  );
};

export default ReservationsView;
