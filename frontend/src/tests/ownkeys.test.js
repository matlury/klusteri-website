import {
  getByLabelText,
  render,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import OwnKeys from "../../src/pages/ownkeys";
import React from "react";
import mockAxios from "../../__mocks__/axios";
import { act } from "react-dom/test-utils";

afterEach(() => {
  // cleaning up the mess left behind the previous test
  mockAxios.reset();
});

describe("OwnKeys Component", () => {
  it("opens without logging in", () => {
    const { getByText } = render(<OwnKeys isLoggedIn={false} />);
    expect(getByText("Kirjaudu sisään")).toBeInTheDocument();
  });

  it("opens with role 1", () => {
    const user = {
      username: "example_username",
      email: "example_email@example.com",
      telegram: "example_telegram",
      role: 1,
      keys: {"tko-äly": true},
      organization: {"tko-äly": true},
      rights_for_reservation: true,
      id: 1
    };

    localStorage.setItem("loggedUser", JSON.stringify(user));
    const { getByText, getByLabelText } = render(
      <OwnKeys isLoggedIn={true} loggedUser={user} />,
    );

    expect(getByText("Kenestä otat vastuun?")).toBeInTheDocument();
    expect(getByText("Kirjaa sisään muita henkilöitä")).toBeInTheDocument();
  });

  it("taking responsibility works", async () => {
    const user = {
      username: "example_username",
      email: "example_email@example.com",
      telegram: "example_telegram",
      role: 1,
      keys: {"tko-äly": true},
      organization: {"tko-äly": true},
      rights_for_reservation: true,
      id: 1
    };

    window.confirm = jest.fn(() => true);
    localStorage.setItem("ACCESS_TOKEN", "example_token");
    localStorage.setItem("loggeduser", JSON.stringify(user));

    const { getByText, getByLabelText, getByTestId } = render(
      <OwnKeys isLoggedIn={true} loggedUser={user} />,
    );

    const responsibile_for = getByLabelText("Kenestä otat vastuun?");
    fireEvent.change(responsibile_for, { target: { value: "fuksit" } });

    const respButton = getByTestId("createresponsibility");
    fireEvent.click(respButton);
    let responseObj = { data: [
      {
          "id": 1,
          "keys": [
              {
                  "id": 1,
                  "user_set": [
                      {
                          "id": 1,
                          "last_login": null,
                          "username": "example_username",
                          "email": "example_email@example.com",
                          "telegram": "telegram",
                          "role": 1,
                          "keys": [
                              1
                          ]
                      }
                  ],
                  "name": "example_org",
                  "email": "example@org.org",
                  "homepage": "example.org",
                  "size": 1
              }
          ],
          "last_login": null,
          "username": "example_username",
          "email": "example_email@example.com",
          "telegram": "telegram",
          "role": 1
      }
    ] };

    mockAxios.mockResponseFor({url: '/listobjects/users/'}, responseObj)

    // Wait for the mockAxios.post to be called
    await waitFor(() => {
      
      expect(mockAxios.get).toHaveBeenCalledWith('/listobjects/users/')
      expect(mockAxios.post).toHaveBeenCalledWith(
        `/ykv/create_responsibility`,
        {
          created_by: "example_username",
          email: "example_email@example.com",
          login_time: expect.anything(),
          organizations: [
            1
          ],
          responsible_for: "fuksit",
          user: user.id,
        },
      );
      expect(mockAxios.get).toHaveBeenCalledWith(
        `listobjects/nightresponsibilities/`,
      );
    });
  });

  it("filtering works", async () => {
    const user = {
      username: "example_username",
      email: "example_email@example.com",
      telegram: "example_telegram",
      role: 1,
      keys: {"tko-äly": true},
      organization: {"tko-äly": true},
      rights_for_reservation: true,
    };

    window.confirm = jest.fn(() => true);
    localStorage.setItem("ACCESS_TOKEN", "example_token");
    localStorage.setItem("loggeduser", JSON.stringify(user));

    const { getByText, getByLabelText, getByTestId, queryByText } = render(
      <OwnKeys isLoggedIn={true} loggedUser={user} />,
    );

    let response = { data: [
      {
          "id": 1,
          "organizations": [
              {
                  "id": 1,
                  "user_set": [
                      {
                          "id": 1,
                          "last_login": null,
                          "username": "example_username",
                          "email": "example_email@example.com",
                          "telegram": "telegram",
                          "role": 1,
                          "keys": [
                              1
                          ]
                      }
                  ],
                  "name": "tko-aly",
                  "email": "tko@aly.com",
                  "homepage": "tko-aly.com",
                  "size": 1
              }
          ],
          "user": {
              "id": 1,
              "keys": [
                  {
                      "id": 1,
                      "user_set": [
                        {
                          "id": 1,
                          "last_login": null,
                          "username": "example_username",
                          "email": "example_email@example.com",
                          "telegram": "telegram",
                          "role": 1,
                          "keys": [
                              1
                          ]
                        }
                      ],
                      "name": "tko-aly",
                      "email": "tko@aly.com",
                      "homepage": "tko-aly.com",
                      "size": 1
                  }
              ],
              "last_login": null,
              "username": "example_username",
              "email": "example_username@example.com",
              "telegram": "telegram",
              "role": 1
          },
          "responsible_for": "fuksit",
          "login_time": "2024-05-30T09:38:07.170043Z",
          "logout_time": "2024-05-30T09:59:08.135103Z",
          "present": true,
          "late": false,
          "created_by": "example_username"
      },
      {
          "id": 2,
          "organizations": [
              {
                  "id": 1,
                  "user_set": [
                    {
                      "id": 1,
                      "last_login": null,
                      "username": "example_username",
                      "email": "example_email@example.com",
                      "telegram": "telegram",
                      "role": 1,
                      "keys": [
                          1
                      ]
                    }
                  ],
                  "name": "tko-aly",
                  "email": "tko@aly.com",
                  "homepage": "tko-aly.com",
                  "size": 1
              }
          ],
          "user": {
              "id": 1,
              "keys": [
                  {
                      "id": 1,
                      "user_set": [
                        {
                          "id": 1,
                          "last_login": null,
                          "username": "example_username",
                          "email": "example_email@example.com",
                          "telegram": "telegram",
                          "role": 1,
                          "keys": [
                              1
                          ]
                        }
                      ],
                      "name": "tko-aly",
                      "email": "tko@aly.com",
                      "homepage": "tko-aly.com",
                      "size": 1
                  }
              ],
              "last_login": null,
              "username": "example_username",
              "email": "example_email@example.com",
              "telegram": "telegram",
              "role": 1
          },
          "responsible_for": "gary",
          "login_time": "2024-05-30T09:59:11.497510Z",
          "logout_time": "2024-05-30T09:59:11.497533Z",
          "present": true,
          "late": false,
          "created_by": "example_username"
      }
  ]}
    const responsedata = { data: [
      {
          "id": 1,
          "keys": [
              {
                  "id": 1,
                  "user_set": [
                      {
                          "id": 1,
                          "last_login": null,
                          "username": "example_username",
                          "email": "example_email@example.com",
                          "telegram": "telegram",
                          "role": 1,
                          "keys": [
                              1
                          ]
                      }
                  ],
                  "name": "example_org",
                  "email": "example@org.org",
                  "homepage": "example.org",
                  "size": 1
              }
          ],
          "last_login": null,
          "username": "example_username",
          "email": "example_email@example.com",
          "telegram": "telegram",
          "role": 1
      }
    ] };

    await waitFor(() => {
    mockAxios.mockResponseFor({url: 'undefined/api/users/userinfo'}, responsedata)
    mockAxios.mockResponseFor({url: 'listobjects/nightresponsibilities/'}, response)

      expect(mockAxios.get).toHaveBeenCalledWith('undefined/api/users/userinfo', {"headers": {"Authorization": "Bearer example_token"}})
      expect(mockAxios.get).toHaveBeenCalledWith('listobjects/nightresponsibilities/')

      const filter = getByTestId("ykvfiltersearch")
      fireEvent.change(filter, { target: { value: "fuksit" } })

      expect(getByText("Vastuussa henkilöistä: fuksit")).toBeInTheDocument();
      expect(queryByText('Vastuussa henkilöistä: gary')).toBeNull()
    })
  })
  it("time filtering works", async () => {
    const user = {
      username: "example_username",
      email: "example_email@example.com",
      telegram: "example_telegram",
      role: 1,
      keys: {"tko-äly": true},
      organization: {"tko-äly": true},
      rights_for_reservation: true,
    };

    window.confirm = jest.fn(() => true);
    localStorage.setItem("ACCESS_TOKEN", "example_token");
    localStorage.setItem("loggeduser", JSON.stringify(user));

    const { getByText, getByLabelText, getByTestId, queryByText } = render(
      <OwnKeys isLoggedIn={true} loggedUser={user} />,
    );

    let response = { data: [
      {
          "id": 1,
          "organizations": [
              {
                  "id": 1,
                  "user_set": [
                      {
                          "id": 1,
                          "last_login": null,
                          "username": "example_username",
                          "email": "example_email@example.com",
                          "telegram": "telegram",
                          "role": 1,
                          "keys": [
                              1
                          ]
                      }
                  ],
                  "name": "tko-aly",
                  "email": "tko@aly.com",
                  "homepage": "tko-aly.com",
                  "size": 1
              }
          ],
          "user": {
              "id": 1,
              "keys": [
                  {
                      "id": 1,
                      "user_set": [
                        {
                          "id": 1,
                          "last_login": null,
                          "username": "example_username",
                          "email": "example_email@example.com",
                          "telegram": "telegram",
                          "role": 1,
                          "keys": [
                              1
                          ]
                        }
                      ],
                      "name": "tko-aly",
                      "email": "tko@aly.com",
                      "homepage": "tko-aly.com",
                      "size": 1
                  }
              ],
              "last_login": null,
              "username": "example_username",
              "email": "example_username@example.com",
              "telegram": "telegram",
              "role": 1
          },
          "responsible_for": "fuksit",
          "login_time": "2024-05-26T09:38:07.170043Z",
          "logout_time": "2024-05-27T09:59:08.135103Z",
          "present": true,
          "late": false,
          "created_by": "example_username"
      },
      {
          "id": 2,
          "organizations": [
              {
                  "id": 1,
                  "user_set": [
                    {
                      "id": 1,
                      "last_login": null,
                      "username": "example_username",
                      "email": "example_email@example.com",
                      "telegram": "telegram",
                      "role": 1,
                      "keys": [
                          1
                      ]
                    }
                  ],
                  "name": "tko-aly",
                  "email": "tko@aly.com",
                  "homepage": "tko-aly.com",
                  "size": 1
              }
          ],
          "user": {
              "id": 1,
              "keys": [
                  {
                      "id": 1,
                      "user_set": [
                        {
                          "id": 1,
                          "last_login": null,
                          "username": "example_username",
                          "email": "example_email@example.com",
                          "telegram": "telegram",
                          "role": 1,
                          "keys": [
                              1
                          ]
                        }
                      ],
                      "name": "tko-aly",
                      "email": "tko@aly.com",
                      "homepage": "tko-aly.com",
                      "size": 1
                  }
              ],
              "last_login": null,
              "username": "example_username",
              "email": "example_email@example.com",
              "telegram": "telegram",
              "role": 1
          },
          "responsible_for": "gary",
          "login_time": "2024-05-29T09:59:11.497510Z",
          "logout_time": "2024-05-30T09:59:11.497533Z",
          "present": true,
          "late": false,
          "created_by": "example_username"
      }
    ]}
    const responsedata = { data: [
      {
          "id": 1,
          "keys": [
              {
                  "id": 1,
                  "user_set": [
                      {
                          "id": 1,
                          "last_login": null,
                          "username": "example_username",
                          "email": "example_email@example.com",
                          "telegram": "telegram",
                          "role": 1,
                          "keys": [
                              1
                          ]
                      }
                  ],
                  "name": "example_org",
                  "email": "example@org.org",
                  "homepage": "example.org",
                  "size": 1
              }
          ],
          "last_login": null,
          "username": "example_username",
          "email": "example_email@example.com",
          "telegram": "telegram",
          "role": 1
      }
    ] };

    await waitFor(() => {
    mockAxios.mockResponseFor({url: 'listobjects/nightresponsibilities/'}, response)
    mockAxios.mockResponseFor({url: 'undefined/api/users/userinfo'}, responsedata)
  
      expect(mockAxios.get).toHaveBeenCalledWith('undefined/api/users/userinfo', {"headers": {"Authorization": "Bearer example_token"}})
      expect(mockAxios.get).toHaveBeenCalledWith('listobjects/nightresponsibilities/')

      const filtermin = getByTestId("timefiltermin")
      const filtermax = getByTestId("timefiltermax")
      fireEvent.change(filtermin, { target: { value: "2024-05-28T01:00" } })
      fireEvent.change(filtermax, { target: { value: "2024-05-31T01:00" } })

      expect(getByText("Vastuussa henkilöistä: gary")).toBeInTheDocument();
      expect(queryByText('Vastuussa henkilöistä: fuksit')).toBeNull()
    })
  })
});
