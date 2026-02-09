import "@testing-library/dom";
import {
  render,
  waitFor,
  fireEvent,
  within,
  screen,
} from "@testing-library/react";
import OwnPage from "../pages/ownpage";
import mockAxios from "../../__mocks__/axios";
import { ContextProvider } from "@context/ContextProvider";
import { Role } from "../roles";

localStorage.setItem("lang", "fi");

afterEach(() => {
  mockAxios.reset();
  localStorage.clear();
  jest.clearAllMocks();
});

beforeEach(() => {
  mockAxios.reset();
  localStorage.clear();
});

describe("OwnPage Component", () => {
  const defaultUser = {
    username: "example_username",
    email: "example_email@example.com",
    telegram: "example_telegram",
    role: Role.TAVALLINEN,
    id: 1,
  };

  const pjUser = {
    username: "leppis",
    email: "leppis@testi.com",
    telegram: "leppistele",
    role: Role.LEPPISPJ,
    id: 1,
  };

  const otherUser = {
    id: 2,
    username: "other",
    email: "other@test.com",
    telegram: "otherthele",
    role: Role.TAVALLINEN,
    resrights: false,
    memberships: []
  };

  const mockInitialRequests = async (user = defaultUser) => {
    await waitFor(() => {
      mockAxios.mockResponseFor({ url: "users/userinfo" }, { data: user });
    });
    await waitFor(() => {
      mockAxios.mockResponseFor({ url: "listobjects/organizations/?include_user_count=true" }, { data: [] });
    });
    await waitFor(() => {
      mockAxios.mockResponseFor({ url: "listobjects/users/" }, { data: [user, otherUser] });
    });
  };

  it("opens without logging in", () => {
    render(
      <ContextProvider>
        <OwnPage isLoggedIn={false} />
      </ContextProvider>
    );
    expect(screen.getByText("Kirjaudu sisään")).toBeInTheDocument();
  });

  it("opens with role 5", async () => {
    localStorage.setItem("loggedUser", JSON.stringify(defaultUser));
    localStorage.setItem("ACCESS_TOKEN", "example_token");

    render(
      <ContextProvider>
        <OwnPage isLoggedIn={true} />
      </ContextProvider>
    );

    await mockInitialRequests();

    expect(screen.getByLabelText("Käyttäjänimi")).toBeInTheDocument();
    expect(screen.getByLabelText("Sähköposti")).toBeInTheDocument();
    expect(screen.getByLabelText(/Telegram/i)).toBeInTheDocument();
    expect(screen.getByText("Käyttäjän rooli: Tavallinen")).toBeInTheDocument();
    expect(screen.getByText("Tallenna")).toBeInTheDocument();
    expect(screen.getByText("Järjestöt")).toBeInTheDocument();
  });

  it("User updating works", async () => {
    window.confirm = jest.fn(() => true);
    localStorage.setItem("ACCESS_TOKEN", "example_token");
    localStorage.setItem("loggedUser", JSON.stringify(pjUser)); // Use PJ to see all sections

    render(
      <ContextProvider>
        <OwnPage isLoggedIn={true} />
      </ContextProvider>
    );

    await mockInitialRequests(pjUser);

    const infoForm = within(screen.getByRole("heading", { name: /omat tiedot/i }).parentElement);
    fireEvent.change(infoForm.getByLabelText("Käyttäjänimi"), { target: { value: "username_example" } });
    fireEvent.change(infoForm.getByLabelText("Sähköposti"), { target: { value: "email_example@example.com" } });
    fireEvent.change(infoForm.getByLabelText("Nykyinen salasana"), { target: { value: "password123" } });

    fireEvent.click(screen.getByTestId("saveuserdata"));

    await waitFor(() => expect(mockAxios.put).toHaveBeenCalled());
    mockAxios.mockResponse({ data: { ...pjUser, username: "username_example" } });

    await waitFor(() => {
      const snackbar = screen.getByTestId("snackbar");
      expect(snackbar).toBeInTheDocument();
      expect(within(snackbar).getByText(/Tiedot päivitetty onnistuneesti/i)).toBeInTheDocument();
    });
  });

  describe("User updating errors", () => {
    it("Updating fails with no username or email", async () => {
      localStorage.setItem("loggedUser", JSON.stringify(defaultUser));
      render(<ContextProvider><OwnPage isLoggedIn={true} /></ContextProvider>);
      await mockInitialRequests();

      const infoForm = within(screen.getByRole("heading", { name: /omat tiedot/i }).parentElement);
      fireEvent.change(infoForm.getByLabelText("Käyttäjänimi"), { target: { value: "" } });
      fireEvent.click(screen.getByTestId("saveuserdata"));

      await waitFor(() => {
        expect(screen.getByTestId("snackbar")).toBeInTheDocument();
        expect(within(screen.getByTestId("snackbar")).getByRole("alert")).toHaveClass("MuiAlert-standardError");
      });
    });

    it("Updating fails with missing current password", async () => {
      localStorage.setItem("loggedUser", JSON.stringify(defaultUser));
      render(<ContextProvider><OwnPage isLoggedIn={true} /></ContextProvider>);
      await mockInitialRequests();

      const infoForm = within(screen.getByRole("heading", { name: /omat tiedot/i }).parentElement);
      fireEvent.change(infoForm.getByLabelText("Käyttäjänimi"), { target: { value: "new" } });
      fireEvent.click(screen.getByTestId("saveuserdata"));

      expect(await screen.findByText(/Nykyinen salasana vaaditaan/i)).toBeInTheDocument();
    });

    it("Handles invalid current password error from backend", async () => {
      window.confirm = jest.fn(() => true);
      localStorage.setItem("loggedUser", JSON.stringify(defaultUser));
      render(<ContextProvider><OwnPage isLoggedIn={true} /></ContextProvider>);
      await mockInitialRequests();

      const infoForm = within(screen.getByRole("heading", { name: /omat tiedot/i }).parentElement);
      fireEvent.change(infoForm.getByLabelText("Nykyinen salasana"), { target: { value: "wrong" } });
      fireEvent.click(screen.getByTestId("saveuserdata"));

      await waitFor(() => expect(mockAxios.put).toHaveBeenCalled());
      mockAxios.mockError({ response: { data: { current_password: ["invalid"] } } });

      expect(await screen.findByText(/Nykyinen salasana on virheellinen/i)).toBeInTheDocument();
    });

    it("Handles telegram already in use error from backend", async () => {
      window.confirm = jest.fn(() => true);
      localStorage.setItem("loggedUser", JSON.stringify(defaultUser));
      render(<ContextProvider><OwnPage isLoggedIn={true} /></ContextProvider>);
      await mockInitialRequests();

      const infoForm = within(screen.getByRole("heading", { name: /omat tiedot/i }).parentElement);
      fireEvent.change(infoForm.getByLabelText("Nykyinen salasana"), { target: { value: "pass" } });
      fireEvent.click(screen.getByTestId("saveuserdata"));

      await waitFor(() => expect(mockAxios.put).toHaveBeenCalled());
      mockAxios.mockError({ response: { data: { telegram: ["exists"] } } });

      expect(await screen.findByText(/Telegram on jo käytössä/i)).toBeInTheDocument();
    });

    it("Updating password with mismatching confirmation fails", async () => {
      localStorage.setItem("loggedUser", JSON.stringify(defaultUser));
      render(<ContextProvider><OwnPage isLoggedIn={true} /></ContextProvider>);
      await mockInitialRequests();

      fireEvent.click(screen.getByText("Vaihda salasana"));
      fireEvent.change(screen.getByLabelText("Uusi salasana"), { target: { value: "Password123" } });
      fireEvent.change(screen.getByLabelText("Vahvista uusi salasana"), { target: { value: "Password456" } });
      fireEvent.change(screen.getByLabelText("Vanha salasana"), { target: { value: "old" } });
      fireEvent.click(screen.getByTestId("savepassword"));

      expect(screen.getByText(/Salasanat eivät täsmää/i)).toBeInTheDocument();
    });

    it("Updating password with too short password fails", async () => {
      localStorage.setItem("loggedUser", JSON.stringify(defaultUser));
      render(<ContextProvider><OwnPage isLoggedIn={true} /></ContextProvider>);
      await mockInitialRequests();

      fireEvent.click(screen.getByText("Vaihda salasana"));
      fireEvent.change(screen.getByLabelText("Uusi salasana"), { target: { value: "Short1" } });
      fireEvent.change(screen.getByLabelText("Vahvista uusi salasana"), { target: { value: "Short1" } });
      fireEvent.change(screen.getByLabelText("Vanha salasana"), { target: { value: "old" } });
      fireEvent.click(screen.getByTestId("savepassword"));

      expect(screen.getByText(/Salasanan tulee olla 8-20 merkkiä pitkä/i)).toBeInTheDocument();
    });

    it("Updating password without complexity fails", async () => {
      localStorage.setItem("loggedUser", JSON.stringify(defaultUser));
      render(<ContextProvider><OwnPage isLoggedIn={true} /></ContextProvider>);
      await mockInitialRequests();

      fireEvent.click(screen.getByText("Vaihda salasana"));
      fireEvent.change(screen.getByLabelText("Uusi salasana"), { target: { value: "onlyletters" } });
      fireEvent.change(screen.getByLabelText("Vahvista uusi salasana"), { target: { value: "onlyletters" } });
      fireEvent.change(screen.getByLabelText("Vanha salasana"), { target: { value: "old" } });
      fireEvent.click(screen.getByTestId("savepassword"));

      expect(screen.getByText(/Salasana ei saa sisältää pelkkiä numeroita tai kirjaimia/i)).toBeInTheDocument();
    });
  });

  describe("Organizations Management", () => {
    it("Organization creating works", async () => {
      localStorage.setItem("loggedUser", JSON.stringify(pjUser));
      render(<ContextProvider><OwnPage isLoggedIn={true} /></ContextProvider>);
      await mockInitialRequests(pjUser);

      fireEvent.click(screen.getByTestId("createneworgbutton"));
      const modal = within(await screen.findByRole("dialog"));

      fireEvent.change(modal.getByTestId("organization-name").querySelector("input"), { target: { value: "tko-aly" } });
      fireEvent.change(modal.getByTestId("organization-email").querySelector("input"), { target: { value: "tko@aly.com" } });
      fireEvent.change(modal.getByTestId("organization-homepage").querySelector("input"), { target: { value: "tko-aly.org" } });

      fireEvent.click(modal.getByText("Luo järjestö"));

      await waitFor(() => expect(mockAxios.get).toHaveBeenCalledWith("listobjects/organizations/?email=tko@aly.com"));
      mockAxios.mockResponse({ data: [] });

      await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith("organizations/create", expect.anything()));
      mockAxios.mockResponse({ data: { id: 2, name: "tko-aly" } });

      expect(await screen.findByText(/Järjestö luotu onnistuneesti/i)).toBeInTheDocument();
    });

    it("Organization detail updating works", async () => {
      const orgs = [{ id: 1, name: "org1", Organisaatio: "org1", email: "o@o.com", kotisivu: "h.com", color: "#000", user_set: [] }];
      window.confirm = jest.fn(() => true);
      localStorage.setItem("loggedUser", JSON.stringify(pjUser));
      render(<ContextProvider><OwnPage isLoggedIn={true} /></ContextProvider>);

      await waitFor(() => mockAxios.mockResponseFor({ url: "users/userinfo" }, { data: pjUser }));
      await waitFor(() => mockAxios.mockResponseFor({ url: "listobjects/organizations/?include_user_count=true" }, { data: orgs }));
      await waitFor(() => mockAxios.mockResponseFor({ url: "listobjects/users/" }, { data: [pjUser, otherUser] }));

      fireEvent.click(await screen.findByTestId("edit-org-1"));
      await waitFor(() => mockAxios.mockResponseFor({ url: "listobjects/organizations/1/" }, { data: { user_set: [] } }));

      const modal = within(screen.getByRole("dialog"));
      // In the modal, there might be multiple "Nimi" labels (DataGrid column header and TextField label)
      // So we scope the search to the modal.
      fireEvent.change(modal.getByLabelText("Nimi"), { target: { value: "neworgname" } });
      fireEvent.click(screen.getByText("Vahvista muutokset"));

      await waitFor(() => expect(mockAxios.put).toHaveBeenCalledWith("organizations/update_organization/1/", expect.anything()));
      mockAxios.mockResponse({ status: 200 });

      expect(await screen.findByText(/Järjestö muokattu onnistuneesti/i)).toBeInTheDocument();
    });

    it("Organization deletion works", async () => {
      const orgs = [{ id: 1, name: "org1", Organisaatio: "org1", email: "o@o.com", kotisivu: "h.com", color: "#000", user_set: [] }];
      window.confirm = jest.fn(() => true);
      localStorage.setItem("loggedUser", JSON.stringify(pjUser));
      render(<ContextProvider><OwnPage isLoggedIn={true} /></ContextProvider>);

      await waitFor(() => mockAxios.mockResponseFor({ url: "users/userinfo" }, { data: pjUser }));
      await waitFor(() => mockAxios.mockResponseFor({ url: "listobjects/organizations/?include_user_count=true" }, { data: orgs }));
      await waitFor(() => mockAxios.mockResponseFor({ url: "listobjects/users/" }, { data: [pjUser, otherUser] }));

      fireEvent.click(await screen.findByTestId("edit-org-1"));
      await waitFor(() => mockAxios.mockResponseFor({ url: "listobjects/organizations/1/" }, { data: { user_set: [] } }));

      fireEvent.click(screen.getByTestId("delete-org-1"));
      await waitFor(() => expect(mockAxios.delete).toHaveBeenCalledWith("organizations/remove/1/"));
      mockAxios.mockResponse({ status: 200 });

      // After deletion, it fetches orgs and users again
      await waitFor(() => expect(mockAxios.get).toHaveBeenCalledWith("listobjects/organizations/?include_user_count=true"));
      mockAxios.mockResponse({ data: [] });
      await waitFor(() => expect(mockAxios.get).toHaveBeenCalledWith("listobjects/users/"));
      mockAxios.mockResponse({ data: [] });

      expect(await screen.findByText(/Järjestö poistettu onnistuneesti/i)).toBeInTheDocument();
    });
  });

  describe("Users Management", () => {
    it("Updating another user works", async () => {
      window.confirm = jest.fn(() => true);
      localStorage.setItem("loggedUser", JSON.stringify(pjUser));
      render(<ContextProvider><OwnPage isLoggedIn={true} /></ContextProvider>);
      await mockInitialRequests(pjUser);

      fireEvent.click(await screen.findByTestId("edit-button-2"));
      const modal = within(screen.getByRole("dialog"));
      fireEvent.change(modal.getByTestId("username-input").querySelector("input"), { target: { value: "newother" } });
      fireEvent.click(modal.getByTestId("save-button"));

      await waitFor(() => expect(mockAxios.put).toHaveBeenCalledWith("users/update/2/", expect.objectContaining({ username: "newother" })));
      mockAxios.mockResponse({ data: { ...otherUser, username: "newother" } });

      expect(await screen.findByText(/Tiedot päivitetty onnistuneesti/i)).toBeInTheDocument();
    });

    it("PJ change works", async () => {
      window.confirm = jest.fn(() => true);
      localStorage.setItem("loggedUser", JSON.stringify(pjUser));
      render(<ContextProvider><OwnPage isLoggedIn={true} /></ContextProvider>);
      await mockInitialRequests(pjUser);

      fireEvent.click(await screen.findByTestId("edit-button-2"));
      const modal = within(screen.getByRole("dialog"));
      fireEvent.click(modal.getByTestId("change-pj-button"));

      await waitFor(() => expect(mockAxios.put).toHaveBeenCalledWith("users/update/2/", expect.objectContaining({ role: Role.LEPPISPJ })));
      mockAxios.mockResponse({ data: { ...otherUser, role: Role.LEPPISPJ } });

      await waitFor(() => expect(mockAxios.put).toHaveBeenCalledWith("users/update/1/", expect.objectContaining({ role: Role.TAVALLINEN })));
      mockAxios.mockResponse({ data: { ...pjUser, role: Role.TAVALLINEN } });
    });

    it("Key handover works", async () => {
      window.confirm = jest.fn(() => true);
      localStorage.setItem("loggedUser", JSON.stringify(pjUser));
      render(<ContextProvider><OwnPage isLoggedIn={true} /></ContextProvider>);

      await waitFor(() => mockAxios.mockResponseFor({ url: "users/userinfo" }, { data: pjUser }));
      await waitFor(() => mockAxios.mockResponseFor({ url: "listobjects/organizations/?include_user_count=true" }, { data: [{ id: 1, name: "org1", Organisaatio: "org1", email: "o@o.com", kotisivu: "h.com", user_set: [] }] }));
      await waitFor(() => mockAxios.mockResponseFor({ url: "listobjects/users/" }, { data: [pjUser, otherUser] }));

      fireEvent.click(await screen.findByTestId("edit-button-2"));
      const modal = within(screen.getByRole("dialog"));
      fireEvent.click(modal.getByTestId("expand-key-accordion"));

      const orgInput = modal.getByLabelText("Valitse organisaatio");
      fireEvent.change(orgInput, { target: { value: "org1" } });
      fireEvent.keyDown(orgInput, { key: "ArrowDown" });
      fireEvent.keyDown(orgInput, { key: "Enter" });

      fireEvent.click(modal.getByTestId("submit-key-button"));

      await waitFor(() => expect(mockAxios.put).toHaveBeenCalledWith("keys/hand_over_key/2/", { organization_name: "org1" }));
      mockAxios.mockResponse({ status: 200 });

      expect(await screen.findByText(/Avaimen luovutus onnistui/i)).toBeInTheDocument();
    });
  });

  describe("Permissions Coverage", () => {
    it("handles different roles in getPermission", async () => {
      const roles = [Role.LEPPISVARAPJ, Role.MUOKKAUS, Role.JARJESTOPJ];
      for (const role of roles) {
        localStorage.clear();
        mockAxios.reset();
        localStorage.setItem("loggedUser", JSON.stringify({ ...defaultUser, role }));
        const { unmount } = render(<ContextProvider><OwnPage isLoggedIn={true} /></ContextProvider>);
        await mockInitialRequests({ ...defaultUser, role });
        expect(screen.queryByText("Luo uusi järjestö")).not.toBeInTheDocument();
        expect(screen.getByText("Käyttäjät")).toBeInTheDocument();
        unmount();
      }
    });
  });
});