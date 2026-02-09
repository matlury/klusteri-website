import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import NewAccountPage from "../../src/pages/createpage";
import mockAxios from "../../__mocks__/axios";
import "@testing-library/dom";

// Test value for the reCAPTCHA site key
process.env.VITE_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

localStorage.setItem("lang", "fi")

describe("NewAccountPage", () => {
  test("displays error when fields are empty", async () => {
    const { getByText, getByRole } = render(<NewAccountPage />);

    await waitFor(() => {
      fireEvent.click(getByRole('button', { name: /Luo tili/i }));
    });

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
    const password2Input = getByLabelText("Vahvista salasana");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(password2Input, { target: { value: "password234" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    await waitFor(() => {
      fireEvent.click(getByRole('button', { name: /Luo tili/i }));
    });

    await waitFor(() => {
      expect(getByText("Salasanat eivät täsmää.")).toBeTruthy();
    });
  });

  test("displays error when username is too long", async () => {
    const { getByText, getByLabelText, getByRole } = render(<NewAccountPage />);

    const usernameInput = getByLabelText("Käyttäjänimi");
    const emailInput = getByLabelText("Sähköposti");
    const passwordInput = getByLabelText("Salasana");
    const password2Input = getByLabelText("Vahvista salasana");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(password2Input, { target: { value: "password123" } });
    fireEvent.change(usernameInput, {
      target: { value: "testuseronliianpitkänimi123456" },
    });

    await waitFor(() => {
      fireEvent.click(getByRole('button', { name: /Luo tili/i }));
    });

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
    const password2Input = getByLabelText("Vahvista salasana");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, {
      target: { value: "password12345678912345" },
    });
    fireEvent.change(password2Input, {
      target: { value: "password12345678912345" },
    });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    await waitFor(() => {
      fireEvent.click(getByRole('button', { name: /Luo tili/i }));
    });

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
    const password2Input = getByLabelText("Vahvista salasana");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "pass12" } });
    fireEvent.change(password2Input, { target: { value: "pass12" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    await waitFor(() => {
      fireEvent.click(getByRole('button', { name: /Luo tili/i }));
    });

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
    const password2Input = getByLabelText("Vahvista salasana");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "12345678" } });
    fireEvent.change(password2Input, { target: { value: "12345678" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    await waitFor(() => {
      fireEvent.click(getByRole('button', { name: /Luo tili/i }));
    });

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
    const password2Input = getByLabelText("Vahvista salasana");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "salasanaaaaa" } });
    fireEvent.change(password2Input, { target: { value: "salasanaaaaa" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    await waitFor(() => {
      fireEvent.click(getByRole('button', { name: /Luo tili/i }));
    });

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
    const password2Input = getByLabelText("Vahvista salasana");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "salasana1" } });
    fireEvent.change(password2Input, { target: { value: "salasana1" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    await waitFor(() => {
      fireEvent.click(getByRole('button', { name: /Luo tili/i }));
    });

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith("users/register", expect.objectContaining({
        email: "test@example.com",
        username: "testuser",
      }));
    });

    await waitFor(() => {
      mockAxios.mockResponse({ data: { message: "Success" } });
    });

    expect(await screen.findByText("Käyttäjä luotu onnistuneesti")).toBeInTheDocument();
  })

  test("user already exists", async () => {
    const { getByText, getByLabelText, getByRole } = render(<NewAccountPage />);

    const usernameInput = getByLabelText("Käyttäjänimi");
    const emailInput = getByLabelText("Sähköposti");
    const passwordInput = getByLabelText("Salasana");
    const password2Input = getByLabelText("Vahvista salasana");

    fireEvent.change(emailInput, { target: { value: "example_email@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "salasana1" } });
    fireEvent.change(password2Input, { target: { value: "salasana1" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    await waitFor(() => {
      fireEvent.click(getByRole('button', { name: /Luo tili/i }));
    });

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith("users/register", expect.objectContaining({
        email: "example_email@example.com",
      }));
    });

    await waitFor(() => {
      mockAxios.mockError({
        response: {
          status: 400,
          data: { email: ["Sähköposti on jo käytössä."] }
        },
        isAxiosError: true
      });
    });

    const errorMessage = await screen.findByText((content, element) => {
      return element.tagName.toLowerCase() === 'p' && content.includes("Sähköposti on jo käytössä.");
    });

    expect(errorMessage).toBeInTheDocument();
  })
});
