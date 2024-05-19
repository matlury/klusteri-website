import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Contacts from "../../src/pages/contacts";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  createElement: jest.fn(),
}));

test("redirects to Christinaregina page when the link button is clicked", () => {
  const openSpy = jest.spyOn(window, "open").mockImplementation(() => {});

  const { getByText } = render(<Contacts />);
  const linkButton = getByText("Christina Regina");
  fireEvent.click(linkButton);

  expect(openSpy).toHaveBeenCalledWith("/christinaregina", "_self");

  // Restore the original window.open after the test
  openSpy.mockRestore();
});

test("renders Contacts Page component", () => {
  const { getByText } = render(<Contacts />);

  expect(getByText("Christina Regina")).toBeInTheDocument();
  expect(getByText("Domus Gaudium")).toBeInTheDocument();
});
