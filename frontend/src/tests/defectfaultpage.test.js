import {
    getByLabelText,
    render,
    fireEvent,
    waitFor,
  } from "@testing-library/react";
  import "@testing-library/jest-dom";
  import DefectFault from "../../src/pages/defectfaultpage";
  import React from "react";
  import mockAxios from "../../__mocks__/axios";
  
  afterEach(() => {
    // cleaning up the mess left behind the previous test
    mockAxios.reset();
  });
  
  describe("DefectFault Component", () => {
    it("opens without logging in", () => {
      const { getByText } = render(<DefectFault/>);
      expect(getByText("Viat")).toBeInTheDocument();
    });

    it("creating defect works", async () => {
      const user = {
        username: "example_username",
        email: "example_email@example.com",
        telegram: "example_telegram",
        role: 1,
        keys: { "tko-äly": true },
        organization: { "tko-äly": true },
        rights_for_reservation: true,
        id: 1,
      };
  
      window.confirm = jest.fn(() => true);
      localStorage.setItem("ACCESS_TOKEN", "example_token");
      localStorage.setItem("loggeduser", JSON.stringify(user));
  
      const { getByTestId } = render(
        <DefectFault isLoggedIn={true} loggedUser={user} />,
      );
      waitFor(() => {
        const create_form_form = getByTestId("defectfaultdialog");
        fireEvent.click(create_form);
  
        const resp_field = getByTestId("description");
        fireEvent.change(resp_field, { target: { value: "jääkapin ovi rikki" } });
        const respButton = getByTestId("createdefect");
        fireEvent.click(respButton);
  
        let responseObj = {
          data: [
            {
              id: 1,
              description: "jääkapin ovi rikki",
              email_sent: false,
              repaired: false,
              time: expect.anything(),
            },
          ],
        };
  
        mockAxios.mockResponseFor({ url: "/listobjects/defects/" }, responseObj);
        // Wait for the mockAxios.post to be called
        waitFor(() => {
          expect(mockAxios.get).toHaveBeenCalledWith("/listobjects/defects/");
          expect(mockAxios.post).toHaveBeenCalledWith(
            `/defects/create_defect`,
            {
              id: 1,
              description: "jääkapin ovi rikki",
              email_sent: false,
              repaired: false,
              time: expect.anything(),
            },
          );
          expect(mockAxios.get).toHaveBeenCalledWith(
            `listobjects/defects/`,
          );
        });
      });
    });
  });
  