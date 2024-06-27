import {
    render,
    fireEvent,
    waitFor,
    screen,
    within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import CleaningSupplies from "../../src/pages/cleaningsuppliespage.jsx";
import mockAxios from "../../__mocks__/axios";
import i18n from "../i18n.js";

localStorage.setItem("lang", "fi");

afterEach(() => {
    // Cleaning up the mess left behind the previous test
    mockAxios.reset();
});

describe("Cleaningsupplies Component", () => {
    it("doesn't open without logging in", () => {
        render(<CleaningSupplies />);
        expect(screen.getByText("Kirjaudu sisään")).toBeInTheDocument();
    });

    it("creating a new cleaning tool succeeds", async () => {
      const user = {
        username: "superman",
        email: "superman@example.com",
        telegram: "super_telegram",
        role: 1,
        keys: { "tko-äly": true },
        organization: { "tko-äly": true },
        rights_for_reservation: true,
        id: 1,
      };
  
      window.confirm = jest.fn(() => true);
      localStorage.setItem("ACCESS_TOKEN", "example_token");
      localStorage.setItem("loggeduser", JSON.stringify(user));
  
      render(<CleaningSupplies isLoggedIn={true} loggedUser={user} />);
  
      // Simulate opening of the dialog for creating new cleaning tool:
      fireEvent.click(screen.getByTestId("addcleaningsupplies"));
  
      // Fill in the defect description
      const descriptionInput = screen.getByTestId("description").querySelector("input");
      fireEvent.change(descriptionInput, { target: { value: "imuri" } });
  
      // Simulate clicking the create button
      fireEvent.click(screen.getByTestId("createtool"));
  
      // Mock the response
      const responseObj = {
        data: [
          {
            id: 1,
            description: "imuri",
          },
        ],
      };
  
      // Wait for the axios requests to complete
      await waitFor(() => {
        // Mock the axios post request
        mockAxios.mockResponseFor({ url: "/cleaningsupplies/create_tool" }, responseObj);

        expect(mockAxios.post).toHaveBeenCalledWith(
          "/cleaningsupplies/create_tool",
          {
            tool: "imuri",
          }
        );
  
        expect(mockAxios.get).toHaveBeenCalledWith("/listobjects/cleaningsupplies/");
      });
  
      // Check if the description appears in the document
      expect(screen.getByText("Siivousvälineen luonti onnistui")).toBeInTheDocument();
    });

    it("deleting a cleaning tool succeeds", async () => {
      const user = {
        username: "superman",
        email: "superman@example.com",
        telegram: "super_telegram",
        role: 1,
        keys: { "tko-äly": true },
        organization: { "tko-äly": true },
        rights_for_reservation: true,
        id: 1,
      };
  
      window.confirm = jest.fn(() => true);
      localStorage.setItem("ACCESS_TOKEN", "example_token");
      localStorage.setItem("loggeduser", JSON.stringify(user));
  
      render(<CleaningSupplies isLoggedIn={true} loggedUser={user} />);
  
      // Mock the response
      const responseObj = {
        data: [
          {
            id: 1,
            tool: "imuri",
          },
        ],
      };

      await waitFor(() => {
        // Mock the axios get request
        mockAxios.mockResponseFor({ url: "/listobjects/cleaningsupplies/" }, responseObj);
      })

      await waitFor(() => {
        expect(screen.getByText("imuri")).toBeInTheDocument();
      });

      // // Simulate clicking the trashcan for delete:
      fireEvent.click(screen.getByTestId("delete-tool-button"));
   

      fireEvent.click(screen.getByTestId("confirmdelete"));

    //   await waitFor(() => {
    //   expect(screen.getByText("Siivousvälineen poisto onnistui")).toBeInTheDocument();
    // });  

    });
});