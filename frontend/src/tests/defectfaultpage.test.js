import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import DefectFault from "../../src/pages/defectfaultpage";
import mockAxios from "../../__mocks__/axios";

afterEach(() => {
  // Cleaning up the mess left behind the previous test
  mockAxios.reset();
});

describe("DefectFault Component", () => {
  it("doesn't open without logging in", () => {
    render(<DefectFault />);
    expect(screen.getByText("Kirjaudu sisään")).toBeInTheDocument();
  });

  it("creating defect works", async () => {
    const user = {
      username: "example_username",
      email: "example_email@example.com",
      telegram: "example_telegram",
      role: 1,
      keys: { "tko-äly": true },
      organization: { "tko-äly": true },
      rights_for_reservation: true,
      id: 1,
    };

    window.confirm = jest.fn(() => true);
    localStorage.setItem("ACCESS_TOKEN", "example_token");
    localStorage.setItem("loggeduser", JSON.stringify(user));

    render(<DefectFault isLoggedIn={true} loggedUser={user} />);

    // Simulate opening the defect creation dialog
    fireEvent.click(screen.getByTestId("defectfaultdialog"));

    // Fill in the defect description
    const descriptionInput = screen.getByTestId("description").querySelector("input");
    fireEvent.change(descriptionInput, { target: { value: "jääkapin ovi rikki" } });

    // Simulate clicking the create button
    fireEvent.click(screen.getByTestId("createdefect"));

    // Mock the response
    const responseObj = {
      data: [
        {
          id: 1,
          description: "jääkapin ovi rikki",
          email_sent: false,
          repaired: false,
          time: expect.anything(),
        },
      ],
    };

    // Mock the axios post request
    mockAxios.mockResponseFor({ url: "/defects/create_defect" }, responseObj);

    // Wait for the axios requests to complete
    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith(
        "/defects/create_defect",
        {
          description: "jääkapin ovi rikki",
        }
      );

      expect(mockAxios.get).toHaveBeenCalledWith("/listobjects/defects/");
    });

    // Check if the description appears in the document
    expect(screen.getByText("Vian kirjaus onnistui")).toBeInTheDocument();
  });
});
