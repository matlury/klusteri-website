import React from "react";
import { render, fireEvent, waitFor, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import OrganisationPage from "../components/OrganisationPage";
import { Role } from "../roles";
import { organizationsAPI, usersAPI } from "../api/api.ts";

// Mock the API calls
jest.mock("../api/api.ts", () => ({
  organizationsAPI: {
    getOrganization: jest.fn(),
    updateOrganization: jest.fn(),
  },
  usersAPI: {
    updateUser: jest.fn(),
  },
  keysAPI: {
    handOverKey: jest.fn(),
  },
}));

// Mock translations
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

const mockOrganizations = [
  {
    id: 1,
    Organisaatio: "Matrix",
    kotisivu: "https://matrix.fi",
    email: "matrix@helsinki.fi",
    color: "#ff0000",
    Avaimia: 2,
  },
  {
    id: 2,
    Organisaatio: "TKO-äly",
    kotisivu: "https://tko-aly.fi",
    email: "tko-aly@helsinki.fi",
    color: "#0000ff",
    Avaimia: 1,
  },
];

const mockAllUsers = [
  { id: 1, username: "admin", email: "admin@test.com", role: Role.LEPPISPJ, rights_for_reservation: true, memberships: ["Matrix"] },
  { id: 2, username: "user", email: "user@test.com", role: Role.TAVALLINEN, rights_for_reservation: false, memberships: ["Matrix"] },
  { id: 3, username: "newbie", email: "newbie@test.com", role: Role.TAVALLINEN, rights_for_reservation: false, memberships: [] },
];

const mockOrgDetails = {
  data: {
    id: 1,
    name: "Matrix",
    email: "matrix@helsinki.fi",
    homepage: "https://matrix.fi",
    color: "#ff0000",
    user_set: [
      { id: 1, username: "admin", email: "admin@test.com", rights_for_reservation: true },
      { id: 2, username: "user", email: "user@test.com", rights_for_reservation: false },
    ],
  },
};

describe("OrganisationPage", () => {
  const mockHandleOrganizationDetails = jest.fn();
  const mockHandleDeleteOrganization = jest.fn();
  const mockFetchOrganizations = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn(() => true);
    organizationsAPI.getOrganization.mockResolvedValue(mockOrgDetails);
  });

  test("renders organization list", async () => {
    render(
      <OrganisationPage
        organizations={mockOrganizations}
        allUsers={mockAllUsers}
        hasPermissionOrg={true}
        handleOrganizationDetails={mockHandleOrganizationDetails}
        handleDeleteOrganization={mockHandleDeleteOrganization}
        fetchOrganizations={mockFetchOrganizations}
        currentUserRole={Role.LEPPISPJ}
      />
    );

    expect(screen.getByText("resp_orgs")).toBeInTheDocument();
    expect(screen.getByText("Matrix")).toBeInTheDocument();
    expect(screen.getByText("TKO-äly")).toBeInTheDocument();
  });

  test("opens edit dialog and loads keyholders", async () => {
    render(
      <OrganisationPage
        organizations={mockOrganizations}
        allUsers={mockAllUsers}
        hasPermissionOrg={true}
        handleOrganizationDetails={mockHandleOrganizationDetails}
        handleDeleteOrganization={mockHandleDeleteOrganization}
        fetchOrganizations={mockFetchOrganizations}
        currentUserRole={Role.LEPPISPJ}
      />
    );

    const editButtons = screen.getAllByRole("button", { name: "" }).filter(btn => btn.id === "modify_org");
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("editorg")).toBeInTheDocument();
      expect(organizationsAPI.getOrganization).toHaveBeenCalledWith(1);
    });

    expect(screen.getByDisplayValue("Matrix")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.getByText("user")).toBeInTheDocument();
  });

  test("can toggle pending keyholder removal", async () => {
    render(
      <OrganisationPage
        organizations={mockOrganizations}
        allUsers={mockAllUsers}
        hasPermissionOrg={true}
        handleOrganizationDetails={mockHandleOrganizationDetails}
        handleDeleteOrganization={mockHandleDeleteOrganization}
        fetchOrganizations={mockFetchOrganizations}
        currentUserRole={Role.LEPPISPJ}
      />
    );

    fireEvent.click(screen.getAllByRole("button").find(btn => btn.id === "modify_org"));

    await waitFor(() => screen.getByText("admin"));

    const listItems = screen.getAllByRole("listitem");
    const adminItem = listItems.find(item => item.textContent.includes("admin"));
    const removeBtn = adminItem.querySelectorAll('button')[1];

    fireEvent.click(removeBtn);
    fireEvent.click(screen.getByText("confirmchanges"));

    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining("removing_keys: admin"));
  });

  test("can toggle reservation rights", async () => {
    render(
      <OrganisationPage
        organizations={mockOrganizations}
        allUsers={mockAllUsers}
        hasPermissionOrg={true}
        handleOrganizationDetails={mockHandleOrganizationDetails}
        handleDeleteOrganization={mockHandleDeleteOrganization}
        fetchOrganizations={mockFetchOrganizations}
        currentUserRole={Role.LEPPISPJ}
      />
    );

    fireEvent.click(screen.getAllByRole("button").find(btn => btn.id === "modify_org"));

    await waitFor(() => screen.getByText("user"));

    const listItems = screen.getAllByRole("listitem");
    const userItem = listItems.find(item => item.textContent.includes("user"));
    const resRightsBtn = userItem.querySelectorAll('button')[0];

    fireEvent.click(resRightsBtn);
    fireEvent.click(screen.getByText("confirmchanges"));

    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining("user: addresrights"));
  });

  test("can add a new keyholder", async () => {
    render(
      <OrganisationPage
        organizations={mockOrganizations}
        allUsers={mockAllUsers}
        hasPermissionOrg={true}
        handleOrganizationDetails={mockHandleOrganizationDetails}
        handleDeleteOrganization={mockHandleDeleteOrganization}
        fetchOrganizations={mockFetchOrganizations}
        currentUserRole={Role.LEPPISPJ}
      />
    );

    fireEvent.click(screen.getAllByRole("button").find(btn => btn.id === "modify_org"));

    await waitFor(() => screen.getByLabelText("chooseuser"));

    const autocomplete = screen.getByLabelText("chooseuser");
    fireEvent.change(autocomplete, { target: { value: "newbie" } });
    fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
    fireEvent.keyDown(autocomplete, { key: "Enter" });

    fireEvent.click(screen.getByText("add"));

    expect(screen.getByText("newbie")).toBeInTheDocument();

    fireEvent.click(screen.getByText("confirmchanges"));
    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining("adding_keys: newbie"));
  });

  test("executes updates on confirm", async () => {
    render(
      <OrganisationPage
        organizations={mockOrganizations}
        allUsers={mockAllUsers}
        hasPermissionOrg={true}
        handleOrganizationDetails={mockHandleOrganizationDetails}
        handleDeleteOrganization={mockHandleDeleteOrganization}
        fetchOrganizations={mockFetchOrganizations}
        currentUserRole={Role.LEPPISPJ}
      />
    );

    fireEvent.click(screen.getAllByRole("button").find(btn => btn.id === "modify_org"));
    await waitFor(() => screen.getByText("user"));

    const nameInput = document.getElementById("organization_name");
    fireEvent.change(nameInput, { target: { value: "Matrix Updated" } });

    const listItems = screen.getAllByRole("listitem");
    const userItem = listItems.find(item => item.textContent.includes("user"));
    fireEvent.click(userItem.querySelectorAll('button')[0]);

    fireEvent.click(screen.getByText("confirmchanges"));

    await waitFor(() => {
      expect(mockHandleOrganizationDetails).toHaveBeenCalledWith(
        "Matrix Updated",
        "matrix@helsinki.fi",
        "https://matrix.fi",
        "#ff0000",
        1
      );
      expect(usersAPI.updateUser).toHaveBeenCalledWith(2, { rights_for_reservation: true });
      expect(mockFetchOrganizations).toHaveBeenCalled();
    });
  });

  test("handles deletion of organization", async () => {
    render(
      <OrganisationPage
        organizations={mockOrganizations}
        allUsers={mockAllUsers}
        hasPermissionOrg={true}
        handleOrganizationDetails={mockHandleOrganizationDetails}
        handleDeleteOrganization={mockHandleDeleteOrganization}
        fetchOrganizations={mockFetchOrganizations}
        currentUserRole={Role.LEPPISPJ}
      />
    );

    fireEvent.click(screen.getAllByRole("button").find(btn => btn.id === "modify_org"));
    await waitFor(() => screen.getByText("delete"));

    await act(async () => {
      fireEvent.click(screen.getByText("delete"));
    });

    await waitFor(() => {
      expect(mockHandleDeleteOrganization).toHaveBeenCalledWith(1);
      expect(mockFetchOrganizations).toHaveBeenCalled();
    });
  });

  test("restricts res rights management for unauthorized roles", async () => {
    render(
      <OrganisationPage
        organizations={mockOrganizations}
        allUsers={mockAllUsers}
        hasPermissionOrg={true}
        handleOrganizationDetails={mockHandleOrganizationDetails}
        handleDeleteOrganization={mockHandleDeleteOrganization}
        fetchOrganizations={mockFetchOrganizations}
        currentUserRole={Role.TAVALLINEN}
      />
    );

    fireEvent.click(screen.getAllByRole("button").find(btn => btn.id === "modify_org"));
    await waitFor(() => screen.getByText("user"));

    const listItems = screen.getAllByRole("listitem");
    const userItem = listItems.find(item => item.textContent.includes("user"));
    const resRightsBtn = userItem.querySelectorAll('button')[0];

    expect(resRightsBtn).toBeDisabled();
  });

  test("does nothing when update is cancelled", async () => {
    window.confirm = jest.fn(() => false);
    render(
      <OrganisationPage
        organizations={mockOrganizations}
        allUsers={mockAllUsers}
        hasPermissionOrg={true}
        handleOrganizationDetails={mockHandleOrganizationDetails}
        handleDeleteOrganization={mockHandleDeleteOrganization}
        fetchOrganizations={mockFetchOrganizations}
        currentUserRole={Role.LEPPISPJ}
      />
    );

    fireEvent.click(screen.getAllByRole("button").find(btn => btn.id === "modify_org"));
    await waitFor(() => screen.getByText("user"));

    fireEvent.click(screen.getByText("confirmchanges"));

    expect(mockHandleOrganizationDetails).not.toHaveBeenCalled();
  });
});
