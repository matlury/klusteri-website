import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import PrivacyPolicy from "../../src/pages/privacypolicy";
import i18n from "../../i18n.js";

localStorage.setItem("lang", "fi")

test("renders Privacy Policy page component", () => {
  const { getByText } = render(<PrivacyPolicy />);

  expect(getByText("Tietosuojaseloste")).toBeInTheDocument();

  expect(getByText("1. Rekisterinpitäjä")).toBeInTheDocument();
});
