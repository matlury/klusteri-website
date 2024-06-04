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
  });
  