import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Contacts from "../../src/pages/contacts";
import ChristinaRegina from "../../src/pages/christina_regina";
import i18n from "../i18n.js";


jest.mock("../../src/ChristinaRegina.png", () => "mock-christina-regina.png");

localStorage.setItem("lang", "fi");

test("redirects to ChristinaRegina page when the link button is clicked", () => {
  const { getByTestId, getByText } = render(
    <MemoryRouter initialEntries={["/contacts"]}>
      <Routes>
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/christina_regina" element={<ChristinaRegina />} />
      </Routes>
    </MemoryRouter>
  );

 
  const linkButton = getByTestId("christina-regina-link");

  expect(linkButton).toBeInTheDocument();

  fireEvent.click(linkButton);

  expect(getByText("Christina Regina")).toBeInTheDocument();
});

test("renders Contacts Page component", () => {
  const { getByText } = render(
    <MemoryRouter>
      <Contacts />
    </MemoryRouter>
  );

  expect(getByText("Christina Regina")).toBeInTheDocument();
  expect(getByText("Domus Gaudium")).toBeInTheDocument();
});

