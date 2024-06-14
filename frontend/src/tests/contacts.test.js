import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Contacts from "../../src/pages/contacts";
import i18n from "../i18n.js";

localStorage.setItem("lang", "fi");

const ChristinaReginaComponent = () => (
  <div>
    <h1>Christina Regina Page</h1>
  </div>
);

test("redirects to ChristinaRegina page when the link button is clicked", () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={["/contacts"]}>
      <Routes>
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/christina_regina" element={<ChristinaReginaComponent />} />
      </Routes>
    </MemoryRouter>
  );

  const linkButton = getByText("Christina Regina");
  fireEvent.click(linkButton);

  // Ensure the new page has rendered by checking the content of ChristinaRegina
  expect(getByText("Christina Regina Page")).toBeInTheDocument();
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