import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import axiosClient from "../axios.js";
import AllUsers from "../components/AllUsers";
import i18n from "../i18n.js";

localStorage.setItem("lang", "fi");

jest.mock("../axios.js");

const mockUsers = [
  {
    id: 1,
    Käyttäjänimi: "user1",
    email: "user1@example.com",
    Telegram: "user1_telegram",
    Rooli: "LeppisPJ",
    Jäsenyydet: ["Org1", "Org2"],
    resrights: "some_resrights1",
  },
  {
    id: 2,
    Käyttäjänimi: "user2",
    email: "user2@example.com",
    Telegram: "user2_telegram",
    Rooli: "Muu",
    Jäsenyydet: ["Org3"],
    resrights: "some_resrights2",
  },
];

const mockOrganizations = [
  {
    id: 1,
    Organisaatio: "Org1",
    email: "org1@example.com",
    kotisivu: "org1.com",
    color: "blue",
    Avaimia: 2,
  },
  {
    id: 2,
    Organisaatio: "Org2",
    email: "org2@example.com",
    kotisivu: "org2.com",
    color: "red",
    Avaimia: 1,
  },
  {
    id: 3,
    Organisaatio: "Org3",
    email: "org3@example.com",
    kotisivu: "org3.com",
    color: "green",
    Avaimia: 1,
  },
];

beforeEach(() => {
  axiosClient.get.mockImplementation((url) => {
    if (url === "listobjects/users/") {
      return Promise.resolve({ data: mockUsers });
    } else if (url === "listobjects/organizations/") {
      return Promise.resolve({ data: mockOrganizations });
    }
  });
});

const mockHandleUpdateAnotherUser = jest.fn();
const mockHandlePJChange = jest.fn();
const mockHandleKeySubmit = jest.fn();
const mockFetchOrganizations = jest.fn();
const mockGetAllUsers = jest.fn();

test("renders AllUsers component", async () => {
  render(
    <AllUsers
      allUsers={mockUsers}
      organizations={mockOrganizations}
      handleUpdateAnotherUser={mockHandleUpdateAnotherUser}
      hasPermissionOrg={true}
      hasPermission={true}
      handlePJChange={mockHandlePJChange}
      handleKeySubmit={mockHandleKeySubmit}
      fetchOrganizations={mockFetchOrganizations}
      getAllUsers={mockGetAllUsers}
    />,
  );

  await waitFor(() => {
    expect(screen.getByText("Käyttäjät")).toBeInTheDocument();
    expect(screen.getByText("user1@example.com")).toBeInTheDocument();
  });
});

test("opens and populates the user details dialog", async () => {
  render(
    <AllUsers
      allUsers={mockUsers}
      organizations={mockOrganizations}
      handleUpdateAnotherUser={mockHandleUpdateAnotherUser}
      hasPermissionOrg={true}
      hasPermission={true}
      handlePJChange={mockHandlePJChange}
      handleKeySubmit={mockHandleKeySubmit}
      fetchOrganizations={mockFetchOrganizations}
      getAllUsers={mockGetAllUsers}
    />
  );

  await waitFor(() => {
    expect(screen.getByText("user1@example.com")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId("edit-button-1"));

  await waitFor(() => {
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByTestId("username-input").querySelector("input"),
    ).toHaveValue("user1");
    expect(
      screen.getByTestId("email-input").querySelector("input"),
    ).toHaveValue("user1@example.com");
    expect(
      screen.getByTestId("telegram-input").querySelector("input"),
    ).toHaveValue("user1_telegram");
    expect(
      screen.getByTestId("role-select").querySelector("input"),
    ).toHaveValue("LeppisPJ");
  });
});

test(
  "assigns a key to the user",
  async () => {
    render(
      <AllUsers
        allUsers={mockUsers}
        organizations={mockOrganizations}
        handleUpdateAnotherUser={mockHandleUpdateAnotherUser}
        hasPermissionOrg={true}
        hasPermission={true}
        handlePJChange={mockHandlePJChange}
        handleKeySubmit={mockHandleKeySubmit}
        fetchOrganizations={mockFetchOrganizations}
        getAllUsers={mockGetAllUsers}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("user1@example.com")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("edit-button-1"));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("expand-key-accordion"));

    const orgDropdown = screen
      .getByTestId("organization-autocomplete")
      .querySelector("input");
    fireEvent.change(orgDropdown, { target: { value: "Org2" } });

    await waitFor(() => {
      expect(screen.getByText("Org2")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Org2"));

    fireEvent.click(screen.getByTestId("submit-key-button"));

    await waitFor(() => {
      expect(mockHandleKeySubmit).toHaveBeenCalledWith(1, "Org2");
    });
  },
  10 * 1000,
);

test("closes the dialog when cancel button is clicked", async () => {
  render(
    <AllUsers
      allUsers={mockUsers}
      organizations={mockOrganizations}
      handleUpdateAnotherUser={mockHandleUpdateAnotherUser}
      hasPermissionOrg={true}
      hasPermission={true}
      handlePJChange={mockHandlePJChange}
      handleKeySubmit={mockHandleKeySubmit}
      fetchOrganizations={mockFetchOrganizations}
      getAllUsers={mockGetAllUsers}
    />,
  );

  await waitFor(() => {
    expect(screen.getByText("user1@example.com")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId("edit-button-1"));

  await waitFor(() => {
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId("cancel-button"));

  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
