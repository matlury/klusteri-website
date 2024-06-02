import "@testing-library/jest-dom";
import { render, waitFor, fireEvent } from "@testing-library/react";
import OwnPage from "../pages/ownpage";
import mockAxios from "../../__mocks__/axios";

afterEach(() => {
  mockAxios.reset();
});

const user = {
  username: "example_username",
  email: "example_email@example.com",
  telegram: "example_telegram",
  role: 1,
};

localStorage.setItem("loggedUser", JSON.stringify(user));

describe("OwnPage Component", () => {
  it("opens without logging in", () => {
    localStorage.setItem("loggedUser", null);
    const { getByText } = render(<OwnPage isLoggedIn={false} />);
    expect(getByText("Kirjaudu sisään")).toBeInTheDocument();
  });
});

it("opens with role 5", () => {
  const user = {
    username: "example_username",
    email: "example_email@example.com",
    telegram: "example_telegram",
    role: 5,
  };
  localStorage.setItem("loggedUser", JSON.stringify(user));
  const { getByText, getByLabelText } = render(<OwnPage isLoggedIn={true} />);
  expect(getByLabelText("Käyttäjänimi")).toBeInTheDocument();
  expect(getByLabelText("Sähköposti")).toBeInTheDocument();
  expect(getByLabelText("Telegram")).toBeInTheDocument();
  expect(getByText("Käyttäjän rooli: 5")).toBeInTheDocument();
  expect(getByText("Tallenna")).toBeInTheDocument();
  expect(getByText("Järjestöt")).toBeInTheDocument();
});

it("opens with role 1", async () => {
  const user = {
    username: "example_username",
    email: "example_email@example.com",
    telegram: "example_telegram",
    role: 1,
  };
  localStorage.setItem("loggedUser", JSON.stringify(user));
  localStorage.setItem("ACCESS_TOKEN", "example_token");
  const { getByText, getByLabelText } = render(<OwnPage isLoggedIn={true} />);

  let responseObj = {
    data: [
      {
        id: 1,
        keys: [
          {
            id: 1,
            user_set: [
              {
                id: 1,
                last_login: null,
                username: "example_username",
                email: "example_email@example.com",
                telegram: "telegram",
                role: 1,
                keys: [1],
              },
            ],
            name: "example_org",
            email: "example@org.org",
            homepage: "example.org",
            size: 1,
          },
        ],
        last_login: null,
        username: "example_username",
        email: "example_email@example.com",
        telegram: "telegram",
        role: 1,
      },
    ],
  };

  await waitFor(() => {
    mockAxios.mockResponseFor(
      { url: "undefined/api/users/userinfo" },
      responseObj,
    );
    expect(mockAxios.get).toHaveBeenCalledWith("undefined/api/users/userinfo", {
      headers: { Authorization: "Bearer example_token" },
    });
    expect(getByLabelText("Käyttäjänimi")).toBeInTheDocument();
    expect(getByLabelText("Sähköposti")).toBeInTheDocument();
    expect(getByLabelText("Telegram")).toBeInTheDocument();
    expect(getByText("Käyttäjän rooli: 1")).toBeInTheDocument();
    expect(getByText("Tallenna")).toBeInTheDocument();
    expect(getByText("Järjestöt")).toBeInTheDocument();
    expect(getByText("Luo uusi järjestö")).toBeInTheDocument();
    expect(getByText("Käyttäjät")).toBeInTheDocument();
    expect(getByText("Avaimen luovutus")).toBeInTheDocument();
  });
});

it("User updating works", () => {
  const user = {
    username: "example_username",
    email: "example_email@example.com",
    telegram: "example_telegram",
    role: 5,
    id: 1,
  };
  window.confirm = jest.fn(() => true);
  localStorage.setItem("ACCESS_TOKEN", "example_token");
  localStorage.setItem("loggedUser", JSON.stringify(user));
  const { getByText, getByLabelText, getByTestId } = render(
    <OwnPage isLoggedIn={true} />,
  );

  const username_field = getByLabelText("Käyttäjänimi");
  fireEvent.change(username_field, { target: { value: "username_example" } });

  const email_field = getByLabelText("Sähköposti");
  fireEvent.change(email_field, {
    target: { value: "email_example@example.com" },
  });

  const telegram_field = getByLabelText("Telegram");
  fireEvent.change(telegram_field, { target: { value: "telegram_example" } });

  const saveButton = getByTestId("saveuserdata");
  fireEvent.click(saveButton);

  waitFor(() => {
    expect(mockAxios.put).toHaveBeenCalledWith("/users/update/1");
  });
});

describe("User updating errors", () => {
  it("Updating fails with no username or email", async () => {
    const user = {
      username: "example_username",
      email: "example_email@example.com",
      telegram: "example_telegram",
      role: 5,
      id: 1,
    };
    window.confirm = jest.fn(() => true);
    localStorage.setItem("ACCESS_TOKEN", "example_token");
    localStorage.setItem("loggedUser", JSON.stringify(user));
    const { getByText, getByLabelText, getByTestId } = render(
      <OwnPage isLoggedIn={true} />,
    );

    const username_field = getByLabelText("Käyttäjänimi");
    fireEvent.change(username_field, { target: { value: "" } });

    const email_field = getByLabelText("Sähköposti");
    fireEvent.change(email_field, { target: { value: "" } });

    const saveButton = getByTestId("saveuserdata");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        getByText("Virhe: Käyttäjänimi ja sähköposti ovat pakollisia kenttiä."),
      ).toBeInTheDocument();
    });
  });
});
