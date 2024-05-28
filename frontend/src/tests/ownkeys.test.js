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
});
