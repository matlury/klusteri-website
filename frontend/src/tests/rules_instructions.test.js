import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Rules_and_Instructions from "../../src/pages/rules_instructions";

describe("Instructions component opens", () => {

    it("renders Instructions page component", () => {
    const { getByText } = render(<Rules_and_Instructions />);
    expect(getByText("Säännöt ja ohjeet")).toBeInTheDocument();
  });

  it("Shows the rules", () => {
    const { getByText } = render(<Rules_and_Instructions />);
    const rulesButton = getByText(
      "Matlu-klusterin käyttösäännöt",
    );
    fireEvent.click(rulesButton);

    expect(
      getByText("Tapahtuman jälkeinen siivous"),
    ).toBeInTheDocument();
  });

  it("Shows the cleaning rules", () => {
    const { getByText } = render(<Rules_and_Instructions />);
    const cleaningButton = getByText(
      "Siivoussäännöt",
    );
    fireEvent.click(cleaningButton);

    expect(
      getByText("Tapahtuman jälkeinen siivous"),
    ).toBeInTheDocument();
  });

  it("Shows the safety rules", () => {
    const { getByText } = render(<Rules_and_Instructions />);
    const safetyButton = getByText(
      "Matlu-klusterin turvallisen tilan periaatteet",
    );
    fireEvent.click(safetyButton);

    expect(
      getByText("Kunnioita toisia ja heidän omaa tilaa sekä koskemattomuutta"),
    ).toBeInTheDocument();
  });
});
