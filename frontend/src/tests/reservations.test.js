import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Reservations from "../../src/pages/reservations";
import mockAxios from "../../__mocks__/axios.js";

afterEach(() => {
  // cleaning up the mess left behind the previous test
  mockAxios.reset();
});

describe("Reservations component", () => {
  it("renders Reservations component", () => {
    const { getByText } = render(<Reservations />);
    expect(getByText("Varauskalenteri")).toBeInTheDocument();
  });

  it("renders the booking form", () => {
    const { getByText, queryByText } = render(<Reservations />);

    const reservationButton = getByText("Lisää uusi tapahtuma");
    fireEvent.click(reservationButton);

    expect(queryByText("Lisää tapahtuma")).toBeInTheDocument();

    const closeButton = getByText("Sulje");
    fireEvent.click(closeButton);
  });

  it("csv download button works", async () => {
    const user = {
      username: 'example_username',
      email: 'example_email@example.com',
      telegram: 'example_telegram',
      role: 1,
      rights_for_reservation: true
    };

    localStorage.setItem('loggedUser', JSON.stringify(user))
    const { getByText } = render(<Reservations />);

    const response = {data: [
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
      mockAxios.mockResponseFor(
        { url: "undefined/api/listobjects/events/" },
        response,
      );
    })

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith(
        "undefined/api/listobjects/events/",
      )
      const reservationButton = getByText("Lataa tapahtumat CSV-muodossa");
      fireEvent.click(reservationButton);
    })
  }) 

  // it('booking with role 1', async () => {
  //   const { getByText, getByPlaceholderText, queryByText } = render(<Reservations />)

  //   const user = {
  //     username: 'example_username',
  //     email: 'example_email@example.com',
  //     telegram: 'example_telegram',
  //     role: 1,
  //     keys: {},
  //     organization: {},
  //     rights_for_reservation: true
  //   };

  //   localStorage.setItem('loggedUser', JSON.stringify(user))
  //   localStorage.setItem('ACCESS_TOKEN', 'example_token');

  //   const reservationButton = getByText('Lisää uusi tapahtuma')
  //   fireEvent.click(reservationButton)

  //   expect(queryByText('Lisää tapahtuma')).toBeInTheDocument()

  //   fireEvent.change(getByPlaceholderText('Tapahtuman nimi'), { target: { value: 'Test Event' } });
  //   fireEvent.change(getByPlaceholderText('Järjestäjä'), { target: { value: 'Test Organizer' } });
  //   fireEvent.change(getByPlaceholderText('Vastuuhenkilö'), { target: { value: 'Test Responsible' } });
  //   fireEvent.change(getByPlaceholderText('Tapahtuman kuvaus'), { target: { value: 'Test Description' } });
  //   fireEvent.change(getByText('Valitse avoimuus'), { target: {value: 'Avoin tapahtuma' } });
  //   fireEvent.change(getByText('Valitse huone'), { target: { value: 'Kokoushuone' } })

  //   const saveButton = getByText('Tallenna')
  //   fireEvent.click(saveButton);

  //   await waitFor(() => {
  //     expect(axiosClient.post).toHaveBeenCalledWith('events/create_event', {
  //       start: expect.any(String),
  //       end: expect.any(String),
  //       title: 'Test Event',
  //       organizer: 'Test Organizer',
  //       description: 'Test Description',
  //       responsible: 'Test Responsible',
  //       isOpen: 'Avoin tapahtuma',
  //       room: 'Kokoushuone',
  //       id: expect.any(Number),
  //     });
  //   });
  // })
});
