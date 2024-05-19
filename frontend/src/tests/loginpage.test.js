import "@testing-library/jest-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../pages/loginpage";
import axiosClient from "../axios.js";

jest.mock("../axios");

test("renders login form", () => {
  const { getByLabelText, getByText } = render(<LoginPage />);

  const emailInput = getByLabelText("Sähköposti:");
  const passwordInput = getByLabelText("Salasana:");
  const loginButton = getByText("Kirjaudu sisään");
  const createUserButton = getByText("Luo uusi käyttäjä");

  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
  expect(createUserButton).toBeInTheDocument();
});

test("error message when logging in with invalid credentials", async () => {
  axiosClient.post.mockRejectedValueOnce({ response: { status: 401 } });

  // Render the LoginPage component
  const { getByLabelText, getByText, queryByText } = render(
    <LoginPage
      onLogin={jest.fn()}
      onLogout={jest.fn()}
      onCreateNewUser={jest.fn()}
    />,
  );

  // Fill in email and password fields
  const emailInput = getByLabelText("Sähköposti:");
  const passwordInput = getByLabelText("Salasana:");
  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "invalidpassword" } });

  const loginButton = getByText("Kirjaudu sisään");
  fireEvent.click(loginButton);

  await waitFor(() => {
    expect(axiosClient.post).toHaveBeenCalledWith("/token/", {
      email: "test@example.com",
      password: "invalidpassword",
    });

    expect(
      queryByText("Sähköposti tai salasana virheellinen!"),
    ).toBeInTheDocument();
    expect(localStorage.getItem("loggedUser")).toBeNull();
    expect(localStorage.getItem("isLoggedIn")).toBeNull();
  });
});

test("logging in with valid credentials works", async () => {
  const mockUserData = { id: 1, username: "testuser" };
  const mockToken = "mock-access-token";

  // Mock the response of axios post and get requests
  axiosClient.post.mockResolvedValueOnce({ data: { access: mockToken } });
  axiosClient.get.mockResolvedValueOnce({ data: mockUserData });

  // Render the LoginPage component
  const { getByLabelText, queryByText, getByText } = render(
    <LoginPage
      onLogin={jest.fn()}
      onLogout={jest.fn()}
      onCreateNewUser={jest.fn()}
    />,
  );

  // Fill in email and password fields
  const emailInput = getByLabelText("Sähköposti:");
  const passwordInput = getByLabelText("Salasana:");
  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });

  const loginButton = getByText("Kirjaudu sisään");
  fireEvent.click(loginButton);

  await waitFor(() => {
    expect(axiosClient.post).toHaveBeenCalledWith("/token/", {
      email: "test@example.com",
      password: "password123",
    });
    expect(axiosClient.get).toHaveBeenCalledWith("/users/userinfo", {
      headers: {
        Authorization: `Bearer ${mockToken}`,
      },
    });

    expect(localStorage.getItem("loggedUser")).toEqual(
      JSON.stringify(mockUserData),
    );
    expect(localStorage.getItem("isLoggedIn")).toEqual("true");
    expect(
      queryByText("Sähköposti tai salasana virheellinen!"),
    ).not.toBeInTheDocument();
  });
});
