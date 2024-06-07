import { render, fireEvent, waitFor, within } from "@testing-library/react";
import NewAccountPage from "../../src/pages/createpage";
import axiosClient from "../axios.js";
import mockAxios from "../../__mocks__/axios";
import "@testing-library/jest-dom";

describe("NewAccountPage", () => {
  beforeEach(() => {
    axiosClient.post.mockResolvedValue({ data: {} });
  });

  // test("renders the component", () => {
  //   const { getByText } = render(<NewAccountPage />);
  //   expect(getByText("Luo tili")).toBeTruthy();
  // });

  test("displays error when fields are empty", async () => {
    const { getByText, getByRole } = render(<NewAccountPage />);

    fireEvent.click(getByRole('button', { name: /Luo tili/i }));

    await waitFor(() => {
      expect(
        getByText(
          "Käyttäjänimi, salasana, sähköposti ja vahvista salasana ovat pakollisia kenttiä.",
        ),
      ).toBeTruthy();
    });
  });

  test("displays error when passwords dont match", async () => {
    const { getByText, getByLabelText, getByRole } = render(<NewAccountPage />);

    const usernameInput = getByLabelText("Käyttäjänimi");
    const emailInput = getByLabelText("Sähköposti");
    const passwordInput = getByLabelText("Salasana");
    const password2Input = getByLabelText("Vahvista");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(password2Input, { target: { value: "password234" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    fireEvent.click(getByRole('button', { name: /Luo tili/i }));

    await waitFor(() => {
      expect(getByText("Salasanat eivät täsmää.")).toBeTruthy();
    });
  });

  test("displays error when username is too long", async () => {
    const { getByText, getByLabelText, getByRole } = render(<NewAccountPage />);

    const usernameInput = getByLabelText("Käyttäjänimi");
    const emailInput = getByLabelText("Sähköposti");
    const passwordInput = getByLabelText("Salasana");
    const password2Input = getByLabelText("Vahvista");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(password2Input, { target: { value: "password123" } });
    fireEvent.change(usernameInput, {
      target: { value: "testuseronliianpitkänimi123456" },
    });

    fireEvent.click(getByRole('button', { name: /Luo tili/i }));

    await waitFor(() => {
      expect(
        getByText(
          "Käyttäjänimen tulee olla enintään 20 merkkiä eikä saa sisältää välilyöntejä.",
        ),
      ).toBeTruthy();
    });
  });

  test("displays error when password is too long", async () => {
    const { getByText, getByLabelText, getByRole } = render(<NewAccountPage />);

    const usernameInput = getByLabelText("Käyttäjänimi");
    const emailInput = getByLabelText("Sähköposti");
    const passwordInput = getByLabelText("Salasana");
    const password2Input = getByLabelText("Vahvista");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, {
      target: { value: "password12345678912345" },
    });
    fireEvent.change(password2Input, {
      target: { value: "password12345678912345" },
    });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    fireEvent.click(getByRole('button', { name: /Luo tili/i }));

    await waitFor(() => {
      expect(
        getByText("Salasanan tulee olla 8-20 merkkiä pitkä."),
      ).toBeTruthy();
    });
  });

  test("displays error when password is too short", async () => {
    const { getByText, getByLabelText, getByRole } = render(<NewAccountPage />);

    const usernameInput = getByLabelText("Käyttäjänimi");
    const emailInput = getByLabelText("Sähköposti");
    const passwordInput = getByLabelText("Salasana");
    const password2Input = getByLabelText("Vahvista");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "pass12" } });
    fireEvent.change(password2Input, { target: { value: "pass12" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    fireEvent.click(getByRole('button', { name: /Luo tili/i }));

    await waitFor(() => {
      expect(
        getByText("Salasanan tulee olla 8-20 merkkiä pitkä."),
      ).toBeTruthy();
    });
  });

  test("displays error when password is only numbers", async () => {
    const { getByText, getByLabelText, getByRole } = render(<NewAccountPage />);

    const usernameInput = getByLabelText("Käyttäjänimi");
    const emailInput = getByLabelText("Sähköposti");
    const passwordInput = getByLabelText("Salasana");
    const password2Input = getByLabelText("Vahvista");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "12345678" } });
    fireEvent.change(password2Input, { target: { value: "12345678" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    fireEvent.click(getByRole('button', { name: /Luo tili/i }));

    await waitFor(() => {
      expect(
        getByText("Salasana ei saa sisältää pelkkiä numeroita tai kirjaimia."),
      ).toBeTruthy();
    });
  });

  test("displays error when password is only letters", async () => {
    const { getByText, getByLabelText, getByRole } = render(<NewAccountPage />);

    const usernameInput = getByLabelText("Käyttäjänimi");
    const emailInput = getByLabelText("Sähköposti");
    const passwordInput = getByLabelText("Salasana");
    const password2Input = getByLabelText("Vahvista");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "salasanaaaaa" } });
    fireEvent.change(password2Input, { target: { value: "salasanaaaaa" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    fireEvent.click(getByRole('button', { name: /Luo tili/i }));

    await waitFor(() => {
      expect(
        getByText("Salasana ei saa sisältää pelkkiä numeroita tai kirjaimia."),
      ).toBeTruthy();
    });
  });
});

describe("Createpage", () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  afterEach(() => {
    mockAxios.reset();
  })
  
  test("register works with correct info", async () => {
    const { getByText, getByLabelText, getByRole } = render(<NewAccountPage />);

    const usernameInput = getByLabelText("Käyttäjänimi");
    const emailInput = getByLabelText("Sähköposti");
    const passwordInput = getByLabelText("Salasana");
    const password2Input = getByLabelText("Vahvista");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "salasana1" } });
    fireEvent.change(password2Input, { target: { value: "salasana1" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    fireEvent.click(getByRole('button', { name: /Luo tili/i }));

    const resp = {data: [
      {
        "id": 2,
        "keys": [],
        "last_login": null,
        "username": "esa123",
        "email": "esa123@abc.com",
        "telegram": "",
        "role": 1
    },
    {
        "id": 1,
        "keys": [],
        "last_login": null,
        "username": "example_username",
        "email": "example_email@example.com",
        "telegram": "example_telegram",
        "role": 1
    }
    ]}

    mockAxios.get.mockResolvedValueOnce(resp);

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith("undefined/api/listobjects/users/?email=test@example.com");
      expect(getByText("Käyttäjä luotu onnistuneesti!")).toBeInTheDocument();
    });
  })

  test("user already exists", async () => {
    const { getByText, getByLabelText, getByRole } = render(<NewAccountPage />);

    const usernameInput = getByLabelText("Käyttäjänimi");
    const emailInput = getByLabelText("Sähköposti");
    const passwordInput = getByLabelText("Salasana");
    const password2Input = getByLabelText("Vahvista");

    fireEvent.change(emailInput, { target: { value: "example_email@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "salasana1" } });
    fireEvent.change(password2Input, { target: { value: "salasana1" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    fireEvent.click(getByRole('button', { name: /Luo tili/i }));

    const resp = {data: [
      {
        "id": 2,
        "keys": [],
        "last_login": null,
        "username": "esa123",
        "email": "esa123@abc.com",
        "telegram": "",
        "role": 1
    },
    {
        "id": 1,
        "keys": [],
        "last_login": null,
        "username": "example_username",
        "email": "example_email@example.com",
        "telegram": "example_telegram",
        "role": 1
    }
    ]}

    mockAxios.get.mockResolvedValueOnce(resp);

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith("undefined/api/listobjects/users/?email=example_email@example.com");
      
      const errorMessage = getByText((content, element) => {
        return element.tagName.toLowerCase() === 'p' && content.includes("Sähköposti on jo käytössä.");
      });
  
      expect(within(errorMessage).getByText("Sähköposti on jo käytössä.")).toBeInTheDocument();
    });
  })
});
