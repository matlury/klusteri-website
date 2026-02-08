import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react";
import { act } from "react";
 import "@testing-library/jest-dom";
import Reservations from "../../src/pages/reservations";
import mockAxios from "../../__mocks__/axios.js";
import { ContextProvider } from "@context/ContextProvider";
import { Role } from '../../src/roles';

localStorage.setItem("lang", "fi")

afterEach(() => {
  // cleaning up the mess left behind the previous test
  mockAxios.reset();
});

const user = {
  username: "example_username",
  email: "example_email@example.com",
  telegram: "example_telegram",
  role: Role.LEPPISPJ,
  keys: { "tko-äly": true },
  organization: { "tko-äly": true },
  rights_for_reservation: true,
  id: 1,
};

localStorage.setItem("loggedUser", JSON.stringify(user));

describe("Reservations component", () => {
  it("renders Reservations component", () => {
    const { getByText } = render(
      <ContextProvider>
        <Reservations />
      </ContextProvider>
    );
    expect(getByText("Varauskalenteri")).toBeInTheDocument();
  });

  it("renders the booking form", () => {
    const { getByText, queryByText } = render(
      <ContextProvider>
        <Reservations />
      </ContextProvider>
    );

    const reservationButton = getByText("Lisää uusi tapahtuma");
    fireEvent.click(reservationButton);

    expect(queryByText("Lisää tapahtuma")).toBeInTheDocument();

    const startTimeField = screen.getByTestId("startTime").querySelector("input");
    const endTimeField = screen.getByTestId("endTime").querySelector("input");

    fireEvent.change(startTimeField, { target: { value: "2024-06-11T10:00" } });
    fireEvent.change(endTimeField, { target: { value: "2024-06-11T12:00" } });

    expect(startTimeField.value).toBe("2024-06-11T10:00");
    expect(endTimeField.value).toBe("2024-06-11T12:00");

    const closeButton = getByText("Sulje");
    fireEvent.click(closeButton);
  });

  it("csv download button works", async () => {
    const user = {
      username: 'example_username',
      email: 'example_email@example.com',
      telegram: 'example_telegram',
      role: Role.LEPPISPJ,
      rights_for_reservation: true
    };

    localStorage.setItem('loggedUser', JSON.stringify(user))
    const { getByText } = render(
      <ContextProvider>
        <Reservations />
      </ContextProvider>
    );

    const response = {
      data: [
        {
          "id": 1,
          "start": "2024-06-03T07:26:24.237284Z",
          "end": "2024-06-03T07:26:24.237298Z",
          "title": "Tapahtuma",
          "organizer": "Järjestäjä",
          "description": "Kuvaus",
          "responsible": "Vastuuhenkilö",
          "open": true,
          "room": "Kokoushuone"
        },
        {
          "id": 2,
          "start": "2024-06-03T07:30:22.141739Z",
          "end": "2024-06-03T07:30:22.141755Z",
          "title": "Tapahtuma",
          "organizer": "Järjestäjä",
          "description": "Kuvaus",
          "responsible": "Vastuuhenkilö",
          "open": false,
          "room": "Kerhotila"
        }]
    }

    await waitFor(() => {
      act(() => {
        mockAxios.mockResponse(response);
      });
    })

    await waitFor(() => {
      const reservationButton = getByText("Lataa tapahtumat CSV-muodossa");
      fireEvent.click(reservationButton);
    })
  })
});