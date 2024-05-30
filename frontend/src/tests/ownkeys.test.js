import {
  getByLabelText,
  render,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import OwnKeys from "../../src/pages/ownkeys";
import React from "react";
import mockAxios from "../../__mocks__/axios";
import { act } from "react-dom/test-utils";

afterEach(() => {
  // cleaning up the mess left behind the previous test
  mockAxios.reset();
});

describe("OwnKeys Component", () => {
  it("opens without logging in", () => {
    const { getByText } = render(<OwnKeys isLoggedIn={false} />);
    expect(getByText("Kirjaudu sisään")).toBeInTheDocument();
  });

  it("opens with role 1", () => {
    const user = {
      username: "example_username",
      email: "example_email@example.com",
      telegram: "example_telegram",
      role: 1,
      keys: {"tko-äly": true},
      organization: {"tko-äly": true},
      rights_for_reservation: true,
    };

    localStorage.setItem("loggedUser", JSON.stringify(user));
    const { getByText, getByLabelText } = render(
      <OwnKeys isLoggedIn={true} loggedUser={user} />,
    );

    expect(getByText("Kenestä otat vastuun?")).toBeInTheDocument();
    expect(getByText("Kirjaa sisään muita henkilöitä")).toBeInTheDocument();
  });

  it("taking responsibility works", async () => {
    const user = {
      username: "example_username",
      email: "example_email@example.com",
      telegram: "example_telegram",
      role: 1,
      keys: {"tko-äly": true},
      organization: {"tko-äly": true},
      rights_for_reservation: true,
    };

    window.confirm = jest.fn(() => true);
    localStorage.setItem("ACCESS_TOKEN", "example_token");
    localStorage.setItem("loggeduser", JSON.stringify(user));

    const { getByText, getByLabelText, getByTestId } = render(
      <OwnKeys isLoggedIn={true} loggedUser={user} />,
    );

    const responsibile_for = getByLabelText("Kenestä otat vastuun?");
    fireEvent.change(responsibile_for, { target: { value: "fuksit" } });

    const respButton = getByTestId("createresponsibility");
    fireEvent.click(respButton);
    let responseObj = { data: [
      {
          "id": 1,
          "username": "example_username",
          "email": "example_email@example.com",
          "telegram": "example_telegram",
          "role": 1,
          "organization": {
              "tko-äly": true
          },
          "keys": {
              "tko-äly": true
          },
          "rights_for_reservation": true
      },] };
      
    mockAxios.mockResponseFor({url: '/listobjects/users/'}, responseObj)

    // Wait for the mockAxios.post to be called
    await waitFor(() => {
      
      expect(mockAxios.get).toHaveBeenCalledWith('/listobjects/users/')
      expect(mockAxios.post).toHaveBeenCalledWith(
        `/ykv/create_responsibility`,
        {
          created_by: "example_username",
          email: "example_email@example.com",
          login_time: expect.anything(),
          organisations: "tko-äly",
          responsible_for: "fuksit",
          username: "example_username",
        },
      );
      expect(mockAxios.get).toHaveBeenCalledWith(
        `listobjects/nightresponsibilities/`,
      );
    });
  });

  it("filtering works", async () => {
    const user = {
      username: "example_username",
      email: "example_email@example.com",
      telegram: "example_telegram",
      role: 1,
      keys: {"tko-äly": true},
      organization: {"tko-äly": true},
      rights_for_reservation: true,
    };

    window.confirm = jest.fn(() => true);
    localStorage.setItem("ACCESS_TOKEN", "example_token");
    localStorage.setItem("loggeduser", JSON.stringify(user));

    const { getByText, getByLabelText, getByTestId, queryByText } = render(
      <OwnKeys isLoggedIn={true} loggedUser={user} />,
    );

    let response = { data: [
      {
        "id": 46,
        "username": "example_username",
        "email": "example_username",
        "responsible_for": "fuksit",
        "login_time": "2024-05-21T20:13:00Z",
        "logout_time": "2024-05-27T12:17:30.940903Z",
        "present": true,
        "late": false,
        "created_by": "example_username",
        "organisations": "tko-äly"
    },
    {
      "id": 47,
      "username": "example_username",
      "email": "example_username",
      "responsible_for": "barney",
      "login_time": "2024-05-21T20:14:00Z",
      "logout_time": "2024-05-27T12:17:30.940903Z",
      "present": true,
      "late": false,
      "created_by": "example_username",
      "organisations": "tko-äly"
  }
    ]}
    const responsedata = { data: {
      "id": 1,
      "username": "example_username",
      "password": "pbkdf2_sha256$720000$dvnLXQXvNU0szCaM2tdeVy$kVehEN6LlYfyjbHp3TwwNwRAMfzirXnXuFCAbhybGWE=",
      "email": "example_email@example.com",
      "telegram": "example_telegram",
      "role": 1,
      "organization": {
          "tko-äly": true
      },
      "keys": {
          "tko-äly": true
      },
      "rights_for_reservation": true
    }}

    await waitFor(() => {
    mockAxios.mockResponseFor({url: 'listobjects/nightresponsibilities/'}, response)
    mockAxios.mockResponseFor({url: 'undefined/api/users/userinfo'}, responsedata)

      expect(mockAxios.get).toHaveBeenCalledWith('undefined/api/users/userinfo', {"headers": {"Authorization": "Bearer example_token"}})
      expect(mockAxios.get).toHaveBeenCalledWith('listobjects/nightresponsibilities/')

      const filter = getByTestId("ykvfiltersearch")
      fireEvent.change(filter, { target: { value: "fuksit" } })

      expect(getByText("Vastuussa henkilöistä: fuksit")).toBeInTheDocument();
      expect(queryByText('Vastuussa henkilöistä: barney')).toBeNull()
    })
  })
  it("time filtering works", async () => {
    const user = {
      username: "example_username",
      email: "example_email@example.com",
      telegram: "example_telegram",
      role: 1,
      keys: {"tko-äly": true},
      organization: {"tko-äly": true},
      rights_for_reservation: true,
    };

    window.confirm = jest.fn(() => true);
    localStorage.setItem("ACCESS_TOKEN", "example_token");
    localStorage.setItem("loggeduser", JSON.stringify(user));

    const { getByText, getByLabelText, getByTestId, queryByText } = render(
      <OwnKeys isLoggedIn={true} loggedUser={user} />,
    );

    let response = { data: [
      {
        "id": 46,
        "username": "example_username",
        "email": "example_username",
        "responsible_for": "fuksit",
        "login_time": "2024-05-21T20:13:00Z",
        "logout_time": "2024-05-27T12:17:30.940903Z",
        "present": false,
        "late": false,
        "created_by": "example_username",
        "organisations": "tko-äly"
    },
    {
      "id": 47,
      "username": "example_username",
      "email": "example_username",
      "responsible_for": "barney",
      "login_time": "2024-05-29T20:14:00Z",
      "logout_time": "2024-05-30T12:17:30.940903Z",
      "present": false,
      "late": false,
      "created_by": "example_username",
      "organisations": "tko-äly"
  }
    ]}
    const responsedata = { data: {
      "id": 1,
      "username": "example_username",
      "password": "pbkdf2_sha256$720000$dvnLXQXvNU0szCaM2tdeVy$kVehEN6LlYfyjbHp3TwwNwRAMfzirXnXuFCAbhybGWE=",
      "email": "example_email@example.com",
      "telegram": "example_telegram",
      "role": 1,
      "organization": {
          "tko-äly": true
      },
      "keys": {
          "tko-äly": true
      },
      "rights_for_reservation": true
    }}

    await waitFor(() => {
    mockAxios.mockResponseFor({url: 'listobjects/nightresponsibilities/'}, response)
    mockAxios.mockResponseFor({url: 'undefined/api/users/userinfo'}, responsedata)
  
      expect(mockAxios.get).toHaveBeenCalledWith('undefined/api/users/userinfo', {"headers": {"Authorization": "Bearer example_token"}})
      expect(mockAxios.get).toHaveBeenCalledWith('listobjects/nightresponsibilities/')

      const filtermin = getByTestId("timefiltermin")
      const filtermax = getByTestId("timefiltermax")
      fireEvent.change(filtermin, { target: { value: "2024-05-28T01:00" } })
      fireEvent.change(filtermax, { target: { value: "2024-05-31T01:00" } })

      expect(getByText("Vastuussa henkilöistä: barney")).toBeInTheDocument();
      expect(queryByText('Vastuussa henkilöistä: fuksit')).toBeNull()
    })
  })
});
