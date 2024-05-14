import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Rules_and_Instructions from "../../src/pages/rules_instructions";

describe("Instructions component opens", () => {
  it("renders Instructions page component", () => {
    const { getByText, queryByText } = render(<Rules_and_Instructions />);
    expect(getByText("Klusterin käyttösäännöt")).toBeInTheDocument();
  });

  it("Shows the instructions", () => {
    const { getByText, queryByText } = render(<Rules_and_Instructions />);
    const klusteriButton = getByText("Klusterin käyttösäännöt");
    fireEvent.click(klusteriButton);

    expect(getByText("1§ Määräysala")).toBeInTheDocument();
    const closeButton = getByText("Sulje");

    fireEvent.click(closeButton);
    expect(queryByText("Sulje")).not.toBeInTheDocument();
  });

  it("Shows the cleaning rules", () => {
    const { getByText } = render(<Rules_and_Instructions />);
    const cleaningButton = getByText("Siivoussäännöt");
    fireEvent.click(cleaningButton);

    expect(getByText("Tapahtuman jälkeinen siivous")).toBeInTheDocument();
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
