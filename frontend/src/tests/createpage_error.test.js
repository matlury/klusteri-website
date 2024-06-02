import { render, fireEvent, waitFor, within } from "@testing-library/react";
import NewAccountPage from "../../src/pages/createpage";
import "@testing-library/jest-dom";

jest.mock('../utils/newaccountcheck.js', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValueOnce(null)
  }));
  
  
  test("unexpected error", async () => {
    const { getByText, getByLabelText } = render(<NewAccountPage />);
  
    const usernameInput = getByLabelText("Käyttäjänimi");
    const emailInput = getByLabelText("Sähköposti");
    const passwordInput = getByLabelText("Salasana");
    const password2Input = getByLabelText("Vahvista");
  
    fireEvent.change(emailInput, { target: { value: "example_email@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "salasana1" } });
    fireEvent.change(password2Input, { target: { value: "salasana1" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
  
    fireEvent.click(getByText("Luo tili"));
  
    await waitFor(() => {
        expect(getByText("Virhe käyttäjän luonnissa.")).toBeInTheDocument();
    });
  })
  