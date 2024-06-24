import {
  fireEvent,
  render,
  waitFor,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import FrontPage from "../../src/pages/frontpage";
import i18n from "../i18n.js";
import mockAxios from "../../__mocks__/axios";

localStorage.setItem("lang", "fi");

afterEach(() => {
  mockAxios.reset();
});

beforeEach(() => {
  mockAxios.reset();
});

test("renders FrontPage component", () => {
  const { getByText } = render(<FrontPage />);

  expect(getByText("Ilotalo")).toBeInTheDocument();

  expect(
    getByText("”sub hoc tecto cives academici excoluntur”?"),
  ).toBeInTheDocument();
});

test("renders upcoming events", async () => {
  const { getByText } = render(<FrontPage />);

  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 1);
  const customStart = currentDate.toISOString();
  currentDate.setHours(currentDate.getHours() + 2);
  const customEnd = currentDate.toISOString();

  const responseObj = {
    data: [
      {
        id: 1,
        organizer: {
          id: 1,
          user_set: [
            {
              id: 1,
              last_login: null,
              username: "leppis",
              email: "leppis@testi.com",
              telegram: "",
              role: 1,
              rights_for_reservation: false,
              keys: [1],
            },
          ],
          name: "tko-äly",
          email: "tko@aly.com",
          homepage: "tko-aly.org",
          color: "",
        },
        created_by: {
          id: 1,
          keys: [
            {
              id: 1,
              user_set: [
                {
                  id: 1,
                  last_login: null,
                  username: "leppis",
                  email: "leppis@testi.com",
                  telegram: "",
                  role: 1,
                  rights_for_reservation: false,
                  keys: [1],
                },
              ],
              name: "tko-äly",
              email: "tko@aly.com",
              homepage: "tko-aly.org",
              color: "",
            },
          ],
          last_login: null,
          username: "leppis",
          email: "leppis@testi.com",
          telegram: "",
          role: 1,
          rights_for_reservation: false,
        },
        start: customStart,
        end: customEnd,
        title: "Test event",
        description: "Test desc",
        responsible: "Mr responsible",
        open: true,
        room: "Kokoushuone",
      },
      {
        id: 2,
        organizer: {
          id: 1,
          user_set: [
            {
              id: 1,
              last_login: null,
              username: "leppis",
              email: "leppis@testi.com",
              telegram: "",
              role: 1,
              rights_for_reservation: false,
              keys: [1],
            },
          ],
          name: "tko-äly",
          email: "tko@aly.com",
          homepage: "tko-aly.org",
          color: "",
        },
        created_by: {
          id: 1,
          keys: [
            {
              id: 1,
              user_set: [
                {
                  id: 1,
                  last_login: null,
                  username: "leppis",
                  email: "leppis@testi.com",
                  telegram: "",
                  role: 1,
                  rights_for_reservation: false,
                  keys: [1],
                },
              ],
              name: "tko-äly",
              email: "tko@aly.com",
              homepage: "tko-aly.org",
              color: "",
            },
          ],
          last_login: null,
          username: "leppis",
          email: "leppis@testi.com",
          telegram: "",
          role: 1,
          rights_for_reservation: false,
        },
        start: customStart,
        end: customEnd,
        title: "Test event 2",
        description: "desc 2",
        responsible: "mr responsibles long lost twin",
        open: true,
        room: "ChristinaRegina",
      },
    ],
  };

  await waitFor(() => {
    mockAxios.mockResponseFor(
      { url: "undefined/api/listobjects/events/" },
      responseObj,
    );
  });

  await waitFor(() => {
    expect(mockAxios.get).toHaveBeenCalledWith(
      "undefined/api/listobjects/events/",
    );

    expect(getByText("Test event - tko-äly")).toBeInTheDocument();
  });
});

test("event description dialog works", async () => {
  const { getByText, queryByText } = render(<FrontPage />);

  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 1);
  const customStart = currentDate.toISOString();
  currentDate.setHours(currentDate.getHours() + 2);
  const customEnd = currentDate.toISOString();

  const responseObj = {
    data: [
      {
        id: 1,
        organizer: {
          id: 1,
          user_set: [
            {
              id: 1,
              last_login: null,
              username: "leppis",
              email: "leppis@testi.com",
              telegram: "",
              role: 1,
              rights_for_reservation: false,
              keys: [1],
            },
          ],
          name: "tko-äly",
          email: "tko@aly.com",
          homepage: "tko-aly.org",
          color: "",
        },
        created_by: {
          id: 1,
          keys: [
            {
              id: 1,
              user_set: [
                {
                  id: 1,
                  last_login: null,
                  username: "leppis",
                  email: "leppis@testi.com",
                  telegram: "",
                  role: 1,
                  rights_for_reservation: false,
                  keys: [1],
                },
              ],
              name: "tko-äly",
              email: "tko@aly.com",
              homepage: "tko-aly.org",
              color: "",
            },
          ],
          last_login: null,
          username: "leppis",
          email: "leppis@testi.com",
          telegram: "",
          role: 1,
          rights_for_reservation: false,
        },
        start: customStart,
        end: customEnd,
        title: "Test event",
        description: "Test desc",
        responsible: "Mr responsible",
        open: true,
        room: "Kokoushuone",
      },
    ],
  };

  await waitFor(() => {
    mockAxios.mockResponseFor(
      { url: "undefined/api/listobjects/events/" },
      responseObj,
    );
  });

  await waitFor(() => {
    expect(mockAxios.get).toHaveBeenCalledWith(
      "undefined/api/listobjects/events/",
    );

    const moreDetailsButton = getByText("Lisätietoja");

    fireEvent.click(moreDetailsButton);

    expect(screen.getByText(/Test desc/i)).toBeInTheDocument();

    const closeDetails = getByText("Sulje");

    fireEvent.click(closeDetails);
  });

  await waitForElementToBeRemoved(() => screen.queryByText(/Test desc/i));

  expect(queryByText("Test desc")).not.toBeInTheDocument();
});
