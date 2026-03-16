import { render, waitFor } from "@testing-library/react";
import FrontPage from "../pages/frontpage.jsx";
import "@testing-library/dom";
import axios from "axios";

localStorage.setItem("lang", "fi");

jest.mock("axios");

beforeEach(() => {
  // Mock console.log before each test
  jest.spyOn(console, "error").mockImplementation(() => { });
});

test("unexpected error", async () => {
  axios.get.mockRejectedValue(new Error("API Error"));

  // eslint-disable-next-line no-empty-pattern
  const { } = render(<FrontPage />);

  await waitFor(() => {
    expect(console.error).toHaveBeenCalledWith(
      "Virhe tapahtumien hakemisessa:",
      expect.objectContaining({ message: "API Error" }),
    );
  });
});
