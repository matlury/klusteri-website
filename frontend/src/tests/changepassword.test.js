import "@testing-library/jest-dom";
import {
  render,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import { act } from "react";
import OwnPage from "../pages/ownpage";
import mockAxios from "../../__mocks__/axios";
import { ContextProvider } from "@context/ContextProvider";
import { Role } from "../roles";

localStorage.setItem("lang", "fi");

const user = {
  username: "example_username",
  email: "example_email@example.com",
  telegram: "example_telegram",
  role: Role.TAVALLINEN,
  id: 1,
};

afterEach(() => {
  mockAxios.reset();
  localStorage.clear();
});

beforeEach(() => {
  mockAxios.reset();
  localStorage.clear();
  localStorage.setItem("loggedUser", JSON.stringify(user));
  localStorage.setItem("ACCESS_TOKEN", "example_token");
});

const setupMocks = async () => {
  // Mock initial requests
  await waitFor(() => {
    act(() => {
      mockAxios.mockResponseFor({ url: "users/userinfo" }, { data: user });
    });
  });
  await waitFor(() => {
    act(() => {
      mockAxios.mockResponseFor({ url: "listobjects/organizations/?include_user_count=true" }, { data: [] });
    });
  });
  await waitFor(() => {
    act(() => {
      mockAxios.mockResponseFor({ url: "listobjects/users/" }, { data: [] });
    });
  });
};

describe("Change Password Functionality", () => {
  it("navigates to change password tab and shows the form", async () => {
    const { getByText, getByLabelText } = render(
      <ContextProvider>
        <OwnPage isLoggedIn={true} />
      </ContextProvider>
    );

    await setupMocks();

    const changePasswordTab = getByText("Vaihda salasana");
    fireEvent.click(changePasswordTab);

    expect(getByLabelText("Vanha salasana")).toBeInTheDocument();
    expect(getByLabelText("Uusi salasana")).toBeInTheDocument();
    expect(getByLabelText("Vahvista uusi salasana")).toBeInTheDocument();
  });

  it("successfully changes password", async () => {
    window.confirm = jest.fn(() => true);
    const { getByText, getByLabelText, getByTestId } = render(
      <ContextProvider>
        <OwnPage isLoggedIn={true} />
      </ContextProvider>
    );

    await setupMocks();

    const changePasswordTab = getByText("Vaihda salasana");
    fireEvent.click(changePasswordTab);

    fireEvent.change(getByLabelText("Vanha salasana"), { target: { value: "oldpassword123" } });
    fireEvent.change(getByLabelText("Uusi salasana"), { target: { value: "newpassword123" } });
    fireEvent.change(getByLabelText("Vahvista uusi salasana"), { target: { value: "newpassword123" } });

    const saveButton = getByTestId("savepassword");
    fireEvent.click(saveButton);

    await waitFor(() => expect(mockAxios.put).toHaveBeenCalled());
    
    act(() => {
      mockAxios.mockResponse({ data: user });
    });

    await waitFor(() => {
      expect(mockAxios.put).toHaveBeenCalledWith("users/update/1/", expect.objectContaining({
        current_password: "oldpassword123",
        password: "newpassword123",
        confirmPassword: "newpassword123",
      }));
    });

    await waitFor(() => {
      const snackbar = getByTestId("snackbar");
      expect(snackbar).toBeInTheDocument();
      expect(within(snackbar).getByRole("alert")).toHaveClass("MuiAlert-standardSuccess");
    });
  });

  it("shows error when passwords don't match", async () => {
    const { getByText, getByLabelText, getByTestId } = render(
      <ContextProvider>
        <OwnPage isLoggedIn={true} />
      </ContextProvider>
    );

    await setupMocks();

    const changePasswordTab = getByText("Vaihda salasana");
    fireEvent.click(changePasswordTab);

    fireEvent.change(getByLabelText("Vanha salasana"), { target: { value: "oldpassword123" } });
    fireEvent.change(getByLabelText("Uusi salasana"), { target: { value: "newpassword123" } });
    fireEvent.change(getByLabelText("Vahvista uusi salasana"), { target: { value: "wrongpassword" } });

    const saveButton = getByTestId("savepassword");
    fireEvent.click(saveButton);

    await waitFor(() => {
      const snackbar = getByTestId("snackbar");
      expect(snackbar).toBeInTheDocument();
      expect(within(snackbar).getByRole("alert")).toHaveClass("MuiAlert-standardError");
      expect(getByText("Salasanat eivät täsmää.")).toBeInTheDocument();
    });
  });

  it("shows error when new password is too short", async () => {
    const { getByText, getByLabelText, getByTestId } = render(
      <ContextProvider>
        <OwnPage isLoggedIn={true} />
      </ContextProvider>
    );

    await setupMocks();

    const changePasswordTab = getByText("Vaihda salasana");
    fireEvent.click(changePasswordTab);

    fireEvent.change(getByLabelText("Vanha salasana"), { target: { value: "oldpassword123" } });
    fireEvent.change(getByLabelText("Uusi salasana"), { target: { value: "short" } });
    fireEvent.change(getByLabelText("Vahvista uusi salasana"), { target: { value: "short" } });

    const saveButton = getByTestId("savepassword");
    fireEvent.click(saveButton);

    await waitFor(() => {
      const snackbar = getByTestId("snackbar");
      expect(snackbar).toBeInTheDocument();
      expect(within(snackbar).getByRole("alert")).toHaveClass("MuiAlert-standardError");
      expect(getByText("Salasanan tulee olla 8-20 merkkiä pitkä.")).toBeInTheDocument();
    });
  });

  it("shows error when current password is wrong (backend error)", async () => {
    window.confirm = jest.fn(() => true);
    const { getByText, getByLabelText, getByTestId } = render(
      <ContextProvider>
        <OwnPage isLoggedIn={true} />
      </ContextProvider>
    );

    await setupMocks();

    const changePasswordTab = getByText("Vaihda salasana");
    fireEvent.click(changePasswordTab);

    fireEvent.change(getByLabelText("Vanha salasana"), { target: { value: "wrongold" } });
    fireEvent.change(getByLabelText("Uusi salasana"), { target: { value: "newpassword123" } });
    fireEvent.change(getByLabelText("Vahvista uusi salasana"), { target: { value: "newpassword123" } });

    const saveButton = getByTestId("savepassword");
    fireEvent.click(saveButton);

    await waitFor(() => expect(mockAxios.put).toHaveBeenCalled());
    
    mockAxios.mockError({
      response: {
        status: 400,
        data: { current_password: ["Invalid password"] }
      }
    });

    await waitFor(() => {
      const snackbar = getByTestId("snackbar");
      expect(snackbar).toBeInTheDocument();
      expect(within(snackbar).getByRole("alert")).toHaveClass("MuiAlert-standardError");
      expect(getByText("Nykyinen salasana on virheellinen.")).toBeInTheDocument();
    });
  });
});