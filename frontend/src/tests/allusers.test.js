import React from "react";
import { render, fireEvent, waitFor, screen, within } from "@testing-library/react";
import '@testing-library/jest-dom';
import axiosClient from "../axios.js";
import AllUsers from "../components/AllUsers";

jest.mock("../axios.js");

const mockUsers = [
  {
    id: 1,
    username: "user1",
    email: "user1@example.com",
    telegram: "user1_telegram",
    role: "admin",
    keys: [{ name: "Org1" }, { name: "Org2" }],
  },
  {
    id: 2,
    username: "user2",
    email: "user2@example.com",
    telegram: "user2_telegram",
    role: "user",
    keys: [{ name: "Org3" }],
  },
];

const mockOrganizations = [
  {
    id: 1,
    name: "Org1",
    email: "org1@example.com",
    homepage: "org1.com",
    user_set: [{}, {}],
  },
  {
    id: 2,
    name: "Org2",
    email: "org2@example.com",
    homepage: "org2.com",
    user_set: [{}],
  },
  {
    id: 3,
    name: "Org3",
    email: "org3@example.com",
    homepage: "org3.com",
    user_set: [{}],
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

test("renders AllUsers component", async () => {
  render(
    <AllUsers
      handleUpdateAnotherUser={mockHandleUpdateAnotherUser}
      hasPermissionOrg={true}
      hasPermission={true}
      handlePJChange={mockHandlePJChange}
      handleKeySubmit={mockHandleKeySubmit}
    />
  );

  await waitFor(() => {
    expect(screen.getByText("Käyttäjät")).toBeInTheDocument();
    expect(screen.getByText("user1@example.com")).toBeInTheDocument();
  });
});

test("opens and populates the user details dialog", async () => {
  render(
    <AllUsers
      handleUpdateAnotherUser={mockHandleUpdateAnotherUser}
      hasPermissionOrg={true}
      hasPermission={true}
      handlePJChange={mockHandlePJChange}
      handleKeySubmit={mockHandleKeySubmit}
    />
  );

  await waitFor(() => {
    expect(screen.getByText("user1@example.com")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId("edit-button-1"));

  await waitFor(() => {
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId("username-input").querySelector('input')).toHaveValue("user1");
    expect(screen.getByTestId("email-input").querySelector('input')).toHaveValue("user1@example.com");
    expect(screen.getByTestId("telegram-input").querySelector('input')).toHaveValue("user1_telegram");
    expect(screen.getByTestId("role-input").querySelector('input')).toHaveValue("admin");
  });
});

test("assigns a key to the user", async () => {
  render(
    <AllUsers
      handleUpdateAnotherUser={mockHandleUpdateAnotherUser}
      hasPermissionOrg={true}
      hasPermission={true}
      handlePJChange={mockHandlePJChange}
      handleKeySubmit={mockHandleKeySubmit}
    />
  );

  await waitFor(() => {
    expect(screen.getByText("user1@example.com")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId("edit-button-1"));

  await waitFor(() => {
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId("expand-key-accordion"));

  const orgDropdown = screen.getByTestId("organization-autocomplete").querySelector('input');
  fireEvent.change(orgDropdown, { target: { value: "Org2" } });

  await waitFor(() => {
    expect(screen.getByText("Org2")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText("Org2"));

  fireEvent.click(screen.getByTestId("submit-key-button"));

  await waitFor(() => {
    expect(mockHandleKeySubmit).toHaveBeenCalledWith(1, "Org2");
  });
});

test("closes the dialog when cancel button is clicked", async () => {
  render(
    <AllUsers
      handleUpdateAnotherUser={mockHandleUpdateAnotherUser}
      hasPermissionOrg={true}
      hasPermission={true}
      handlePJChange={mockHandlePJChange}
      handleKeySubmit={mockHandleKeySubmit}
    />
  );

  await waitFor(() => {
    expect(screen.getByText("user1@example.com")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId("edit-button-1"));

  await waitFor(() => {
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId("cancel-button"));

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
