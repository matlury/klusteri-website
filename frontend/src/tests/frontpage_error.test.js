import { render, waitFor } from "@testing-library/react";
import FrontPage from "../pages/frontpage.jsx";
import "@testing-library/jest-dom";
import i18n from "../i18n.js";
import axios from "axios";

localStorage.setItem("lang", "fi");

jest.mock("axios");

beforeEach(() => {
  // Mock console.log before each test
  jest.spyOn(console, "error").mockImplementation(() => {});
});

test("unexpected error", async () => {
  axios.get.mockRejectedValue(new Error("API Error"));

  const {} = render(<FrontPage />);

  await waitFor(() => {
    expect(console.error).toHaveBeenCalledWith(
      "Virhe tapahtumien hakemisessa:",
      expect.objectContaining({ message: "API Error" }),
    );
  });
});
