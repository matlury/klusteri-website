import {
    getByLabelText,
    render,
    fireEvent,
    waitFor,
  } from "@testing-library/react";
import "@testing-library/jest-dom";
import Statistics from "../../src/pages/statistics";
import React from "react";
import mockAxios from "../../__mocks__/axios";

afterEach(() => {
    mockAxios.reset();
  });

describe("Statistics page test", () => {
  it("Renders login text when not logged in", () => {
    const { getByText } = render(<Statistics />);

    expect(getByText("Kirjaudu sisään")).toBeInTheDocument();
  });

  it("The correct api requests are made when role is 1" , async () => { 
    // rendering the actual statistics doesn't work for jest, so the test only checks that the api requests are correct
    const user = {
      username: "example_username",
      email: "example_email@example.com",
      telegram: "example_telegram",
      role: 1,
      rights_for_reservation: true,
      id: 1,
    };

    localStorage.setItem("loggedUser", JSON.stringify(user));
    localStorage.setItem("ACCESS_TOKEN", "example_token");

    const { getByText } = render(
      <Statistics />,
    );

    const responseobject = {data: 
    { "id": 1,
    "keys": [
        {
            "id": 1,
            "user_set": [
                {
                    "id": 1,
                    "last_login": null,
                    "username": "example_username",
                    "email": "example_email@example.com",
                    "telegram": "example_telegram",
                    "role": 1,
                    "keys": [
                        1
                    ]
                }
            ],
            "name": "tko-äly",
            "email": "tko@aly.org",
            "homepage": "tko-aly.com",
            "size": 1
        }
    ],
    "last_login": null,
    "username": "example_username",
    "email": "example_email@example.com",
    "telegram": "example_telegram",
    "password": "pbkdf2_sha256$720000$DLGzd60Wxi86fl0ALgPYyI$uZAvY+sTmSRrz/UdX6m1IKv3j2wy4hHz86TijOw+tt8=",
    "role": 1
    }}
     
    const resp = {data: 
      [
        {
            "id": 1,
            "user_set": [
                {
                    "id": 1,
                    "last_login": null,
                    "username": "example_username",
                    "email": "example_email@example.com",
                    "telegram": "example_telegram",
                    "role": 1,
                    "keys": [
                        1
                    ]
                }
            ],
            "name": "tko-äly",
            "email": "tko@aly.org",
            "homepage": "tko-aly.com",
            "size": 1
        },
        {
            "id": 2,
            "user_set": [
                {
                    "id": 2,
                    "last_login": null,
                    "username": "tavallinen",
                    "email": "tavallinen@testi.com",
                    "telegram": "tavallinen",
                    "role": 4,
                    "keys": [
                        2
                    ]
                }
            ],
            "name": "matrix",
            "email": "matrix@matrix-ry.fi",
            "homepage": "matrix-ry.fi",
            "size": 1
        }
      ]
    }

    const response = {data: 
      [
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
                            "telegram": "example_telegram",
                            "role": 1,
                            "keys": [
                                1
                            ]
                        }
                    ],
                    "name": "tko-äly",
                    "email": "tko@aly.org",
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
                                "telegram": "example_telegram",
                                "role": 1,
                                "keys": [
                                    1
                                ]
                            }
                        ],
                        "name": "tko-äly",
                        "email": "tko@aly.org",
                        "homepage": "tko-aly.com",
                        "size": 1
                    }
                ],
                "last_login": null,
                "username": "example_username",
                "email": "example_email@example.com",
                "telegram": "example_telegram",
                "role": 1
            },
            "responsible_for": "fuksit",
            "login_time": "2024-06-03T07:59:14.436507Z",
            "logout_time": "2024-06-03T07:59:43.873152Z",
            "present": false,
            "late": false,
            "created_by": "example_username"
        }, {
          "id": 10,
          "organizations": [
              {
                  "id": 2,
                  "user_set": [
                      {
                          "id": 2,
                          "last_login": null,
                          "username": "tavallinen",
                          "email": "tavallinen@testi.com",
                          "telegram": "tavallinen",
                          "role": 4,
                          "keys": [
                              2
                          ]
                      },
                      {
                          "id": 1,
                          "last_login": null,
                          "username": "example_username",
                          "email": "example_email@example.com",
                          "telegram": "example_telegram",
                          "role": 1,
                          "keys": [
                              1
                          ]
                      }
                  ],
                  "name": "matrix",
                  "email": "matrix@matrix-ry.fi",
                  "homepage": "matrix-ry.fi",
                  "size": 1
              }
          ],
          "user": {
              "id": 2,
              "keys": [
                  {
                      "id": 2,
                      "user_set": [
                          {
                              "id": 2,
                              "last_login": null,
                              "username": "tavallinen",
                              "email": "tavallinen@testi.com",
                              "telegram": "tavallinen",
                              "role": 4,
                              "keys": [
                                  2
                              ]
                          },
                          {
                              "id": 1,
                              "last_login": null,
                              "username": "example_username",
                              "email": "example_email@example.com",
                              "telegram": "example_telegram",
                              "role": 1,
                              "keys": [
                                  1
                              ]
                          }
                      ],
                      "name": "matrix",
                      "email": "matrix@matrix-ry.fi",
                      "homepage": "matrix-ry.fi",
                      "size": 1
                  }
              ],
              "last_login": null,
              "username": "tavallinen",
              "email": "tavallinen@testi.com",
              "telegram": "tavallinen",
              "role": 4
          },
          "responsible_for": "phil",
          "login_time": "2024-06-04T11:11:30.544845Z",
          "logout_time": "2024-06-04T11:11:33.731707Z",
          "present": false,
          "late": false,
          "created_by": "tavallinen"
      }
      ]
    }

    const respp = {data: 
      [
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
                            "telegram": "example_telegram",
                            "role": 1,
                            "keys": [
                                1
                            ]
                        }
                    ],
                    "name": "tko-äly",
                    "email": "tko@aly.org",
                    "homepage": "tko-aly.com",
                    "size": 1
                }
            ],
            "last_login": null,
            "username": "example_username",
            "email": "example_email@example.com",
            "telegram": "example_telegram",
            "role": 1
        }, 
        {
            "id": 3,
            "keys": [],
            "last_login": null,
            "username": "sheamus",
            "email": "sheamus@s.com",
            "telegram": "",
            "role": 5
        }, {
          "id": 2,
          "keys": [
              {
                  "id": 2,
                  "user_set": [
                      {
                          "id": 2,
                          "last_login": null,
                          "username": "tavallinen",
                          "email": "tavallinen@testi.com",
                          "telegram": "tavallinen",
                          "role": 4,
                          "keys": [
                              2
                          ]
                      },
                      {
                          "id": 1,
                          "last_login": null,
                          "username": "example_username",
                          "email": "example_email@example.com",
                          "telegram": "example_telegram",
                          "role": 1,
                          "keys": [
                              1
                          ]
                      }
                  ],
                  "name": "matrix",
                  "email": "matrix@matrix-ry.fi",
                  "homepage": "matrix-ry.fi",
                  "size": 1
              }
          ],
          "last_login": null,
          "username": "tavallinen",
          "email": "tavallinen@testi.com",
          "telegram": "tavallinen",
          "role": 4
        }
      ]
    }

    await waitFor(() => {
    mockAxios.mockResponseFor({ url: "undefined/api/users/userinfo" }, responseobject);
    })

    await waitFor(() => {
    mockAxios.mockResponseFor({ url: "listobjects/organizations/" }, resp);
    })

    await waitFor(() => {      
    mockAxios.mockResponseFor({ url: "listobjects/nightresponsibilities/" }, response)
    })

    await waitFor(() => {      
      mockAxios.mockResponseFor({ url: "listobjects/users/" }, respp)
    })

    await waitFor(() => {      
      mockAxios.mockResponseFor({ url: "listobjects/nightresponsibilities/" }, response)
    })
  

    await waitFor(() => {
    expect(mockAxios.get).toHaveBeenCalledWith("undefined/api/users/userinfo", {"headers": {"Authorization": "Bearer example_token"}})
    expect(mockAxios.get).toHaveBeenCalledWith("listobjects/organizations/")
    expect(mockAxios.get).toHaveBeenCalledWith("listobjects/nightresponsibilities/")
    expect(mockAxios.get).toHaveBeenCalledWith("listobjects/users/")
    })
  })
});
