import {
  render,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { act } from "react";
import "@testing-library/jest-dom";
import OwnKeys from "../../src/pages/ownkeys";
import { ContextProvider } from "@context/ContextProvider";
import mockAxios from "../../__mocks__/axios";

localStorage.setItem("lang", "fi")

afterEach(() => {
  // cleaning up the mess left behind the previous test
  mockAxios.reset();
});

describe("OwnKeys Component", () => {
  it("opens without logging in", () => {
    const { getByText } = render(
      <ContextProvider>
        <OwnKeys />
      </ContextProvider>,
    );
    expect(getByText("Kirjaudu")).toBeInTheDocument();
  });

  it("opens with role 1", async () => {
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

    localStorage.setItem("loggedUser", JSON.stringify(user));

    const { getByText, getByTestId } = render(
      <ContextProvider>
        <OwnKeys />
      </ContextProvider>,
    );

    // mock permission and responsibilities responses (respond after requests issued)
    await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());
    act(() => {
      mockAxios.mockResponseFor({ url: "users/userinfo" }, { data: user });
    });
    await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());
    // respond to eligible users request (ykv) which happens after permission is set
    act(() => {
      mockAxios.mockResponseFor({ url: "users/ykv/" }, { data: [] });
    });
    await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());
    act(() => {
      mockAxios.mockResponseFor({ url: "listobjects/nightresponsibilities/" }, { data: [] });
    });

    // open the create dialog and assert fields inside
    const createBtn = getByTestId("opencreateform");
    fireEvent.click(createBtn);
    await waitFor(() => {
      expect(getByText("Kenestä otat vastuun?")).toBeInTheDocument();
      expect(getByText("Kirjaa toisen käyttäjän puolesta")).toBeInTheDocument();
    });
  });

  it("taking responsibility works", async () => {
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
    localStorage.setItem("loggedUser", JSON.stringify(user));

    const { getByTestId, findByRole } = render(
      <ContextProvider>
        <OwnKeys />
      </ContextProvider>,
    );
    // respond to initial requests before interacting with the UI
    await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());
    act(() => {
      mockAxios.mockResponseFor({ url: "users/userinfo" }, { data: user });
    });
    await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());
    act(() => {
      mockAxios.mockResponseFor({ url: "users/ykv/" }, { data: [] });
    });
    await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());
    act(() => {
      mockAxios.mockResponseFor({ url: "listobjects/nightresponsibilities/" }, { data: [] });
    });
    const create_form = getByTestId("opencreateform");
    fireEvent.click(create_form);
    const resp_field_input = await findByRole("textbox", { name: "Kenestä otat vastuun?" });
    fireEvent.change(resp_field_input, { target: { value: "fuksit" } });
    const respButton = getByTestId("createresponsibility");
    fireEvent.click(respButton);

    await waitFor(() => expect(mockAxios.post).toHaveBeenCalled());
    act(() => {
      mockAxios.mockResponseFor({ url: "ykv/create_responsibility" }, { data: {} });
    });
    await waitFor(() => expect(mockAxios.get).toHaveBeenCalledWith("listobjects/nightresponsibilities/"));
    act(() => {
      mockAxios.mockResponseFor({ url: "listobjects/nightresponsibilities/" }, { data: [] });
    });
    await waitFor(() => {
      const snackbar = getByTestId("snackbar");
      expect(snackbar).toBeInTheDocument();
      expect(within(snackbar).getByRole("alert")).toHaveClass("MuiAlert-standardSuccess");
    });
    expect(mockAxios.get).toHaveBeenCalledWith("users/userinfo");
    expect(mockAxios.get).toHaveBeenCalledWith("users/ykv/");
    expect(mockAxios.post).toHaveBeenCalledWith(
      "ykv/create_responsibility",
      expect.objectContaining({
        created_by: "example_username",
        responsible_for: "fuksit",
        user: user.id,
      }),
    );
    expect(mockAxios.get).toHaveBeenCalledWith(
      `listobjects/nightresponsibilities/`,
    );
  });

  it("filtering works", async () => {
    const user = {
      username: "example_username",
      email: "example_email@example.com",
      telegram: "example_telegram",
      role: 1,
      keys: { "tko-äly": true },
      organization: { "tko-äly": true },
      rights_for_reservation: true,
    };

    window.confirm = jest.fn(() => true);
    localStorage.setItem("ACCESS_TOKEN", "example_token");
    localStorage.setItem("loggedUser", JSON.stringify(user));

    const { getByText, queryByText, getByLabelText } = render(
      <ContextProvider>
        <OwnKeys />
      </ContextProvider>,
    );

    let response = {
      data: [
        {
          id: 1,
          organizations: [
            {
              id: 1,
              user_set: [
                {
                  id: 1,
                  last_login: null,
                  username: "example_username",
                  email: "example_email@example.com",
                  telegram: "telegram",
                  role: 1,
                  keys: [1],
                },
              ],
              name: "tko-aly",
              email: "tko@aly.com",
              homepage: "tko-aly.com",
              size: 1,
            },
          ],
          user: {
            id: 1,
            keys: [
              {
                id: 1,
                user_set: [
                  {
                    id: 1,
                    last_login: null,
                    username: "example_username",
                    email: "example_email@example.com",
                    telegram: "telegram",
                    role: 1,
                    keys: [1],
                  },
                ],
                name: "tko-aly",
                email: "tko@aly.com",
                homepage: "tko-aly.com",
                size: 1,
              },
            ],
            last_login: null,
            username: "example_username",
            email: "example_username@example.com",
            telegram: "telegram",
            role: 1,
          },
          responsible_for: "fuksit",
          login_time: "2024-05-30T09:38:07.170043Z",
          logout_time: "2024-05-30T09:59:08.135103Z",
          present: true,
          late: false,
          created_by: "example_username",
        },
        {
          id: 2,
          organizations: [
            {
              id: 1,
              user_set: [
                {
                  id: 1,
                  last_login: null,
                  username: "example_username",
                  email: "example_email@example.com",
                  telegram: "telegram",
                  role: 1,
                  keys: [1],
                },
              ],
              name: "tko-aly",
              email: "tko@aly.com",
              homepage: "tko-aly.com",
              size: 1,
            },
          ],
          user: {
            id: 1,
            keys: [
              {
                id: 1,
                user_set: [
                  {
                    id: 1,
                    last_login: null,
                    username: "example_username",
                    email: "example_email@example.com",
                    telegram: "telegram",
                    role: 1,
                    keys: [1],
                  },
                ],
                name: "tko-aly",
                email: "tko@aly.com",
                homepage: "tko-aly.com",
                size: 1,
              },
            ],
            last_login: null,
            username: "example_username",
            email: "example_email@example.com",
            telegram: "telegram",
            role: 1,
          },
          responsible_for: "gary",
          login_time: "2024-05-30T09:59:11.497510Z",
          logout_time: "2024-05-30T09:59:11.497533Z",
          present: true,
          late: false,
          created_by: "example_username",
        },
      ],
    };
    const responsedata = {
      data: [
        {
          id: 1,
          keys: [
            {
              id: 1,
              user_set: [
                {
                  id: 1,
                  last_login: null,
                  username: "example_username",
                  email: "example_email@example.com",
                  telegram: "telegram",
                  role: 1,
                  keys: [1],
                },
              ],
              name: "example_org",
              email: "example@org.org",
              homepage: "example.org",
              size: 1,
            },
          ],
          last_login: null,
          username: "example_username",
          email: "example_email@example.com",
          telegram: "telegram",
          role: 1,
        },
      ],
    };
    await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());
    act(() => {
      mockAxios.mockResponseFor({ url: "users/userinfo" }, responsedata);
    });
    await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());
    act(() => {
      mockAxios.mockResponseFor({ url: "users/ykv/" }, { data: [] });
    });
    await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());
    act(() => {
      mockAxios.mockResponseFor({ url: "listobjects/nightresponsibilities/" }, response);
    });

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith("users/userinfo");
      expect(mockAxios.get).toHaveBeenCalledWith(
        "listobjects/nightresponsibilities/",
      );

      const filter = getByLabelText("Hae yökäyttövastuista");
      fireEvent.change(filter, { target: { value: "fuksit" } });

      expect(getByText("fuksit")).toBeInTheDocument();
      expect(queryByText("gary")).toBeNull();
    });
  });

  //  it("time filtering works", async () => {
  //    const user = {
  //      username: "example_username",
  //      email: "example_email@example.com",
  //      telegram: "example_telegram",
  //      role: 1,
  //      keys: {"tko-äly": true},
  //      organization: {"tko-äly": true},
  //      rights_for_reservation: true,
  //    };
  //
  //    window.confirm = jest.fn(() => true);
  //    localStorage.setItem("ACCESS_TOKEN", "example_token");
  //    localStorage.setItem("loggeduser", JSON.stringify(user));
  //
  //    const { getByText, getByLabelText, getByTestId, queryByText } = render(
  //      <OwnKeys isLoggedIn={true} loggedUser={user} />,
  //    );
  //
  //    let response = { data: [
  //      {
  //          "id": 1,
  //          "organizations": [
  //              {
  //                  "id": 1,
  //                  "user_set": [
  //                      {
  //                          "id": 1,
  //                          "last_login": null,
  //                          "username": "example_username",
  //                          "email": "example_email@example.com",
  //                          "telegram": "telegram",
  //                          "role": 1,
  //                          "keys": [
  //                              1
  //                          ]
  //                      }
  //                  ],
  //                  "name": "tko-aly",
  //                  "email": "tko@aly.com",
  //                  "homepage": "tko-aly.com",
  //                  "size": 1
  //              }
  //          ],
  //          "user": {
  //              "id": 1,
  //              "keys": [
  //                  {
  //                      "id": 1,
  //                      "user_set": [
  //                        {
  //                          "id": 1,
  //                          "last_login": null,
  //                          "username": "example_username",
  //                          "email": "example_email@example.com",
  //                          "telegram": "telegram",
  //                          "role": 1,
  //                          "keys": [
  //                              1
  //                          ]
  //                        }
  //                      ],
  //                      "name": "tko-aly",
  //                      "email": "tko@aly.com",
  //                      "homepage": "tko-aly.com",
  //                      "size": 1
  //                  }
  //              ],
  //              "last_login": null,
  //              "username": "example_username",
  //              "email": "example_username@example.com",
  //              "telegram": "telegram",
  //              "role": 1
  //          },
  //          "responsible_for": "fuksit",
  //          "login_time": "2024-05-26T09:38:07.170043Z",
  //          "logout_time": "2024-05-27T09:59:08.135103Z",
  //          "present": true,
  //          "late": false,
  //          "created_by": "example_username"
  //      },
  //      {
  //          "id": 2,
  //          "organizations": [
  //              {
  //                  "id": 1,
  //                  "user_set": [
  //                    {
  //                      "id": 1,
  //                      "last_login": null,
  //                      "username": "example_username",
  //                      "email": "example_email@example.com",
  //                      "telegram": "telegram",
  //                      "role": 1,
  //                      "keys": [
  //                          1
  //                      ]
  //                    }
  //                  ],
  //                  "name": "tko-aly",
  //                  "email": "tko@aly.com",
  //                  "homepage": "tko-aly.com",
  //                  "size": 1
  //              }
  //          ],
  //          "user": {
  //              "id": 1,
  //              "keys": [
  //                  {
  //                      "id": 1,
  //                      "user_set": [
  //                        {
  //                          "id": 1,
  //                          "last_login": null,
  //                          "username": "example_username",
  //                          "email": "example_email@example.com",
  //                          "telegram": "telegram",
  //                          "role": 1,
  //                          "keys": [
  //                              1
  //                          ]
  //                        }
  //                      ],
  //                      "name": "tko-aly",
  //                      "email": "tko@aly.com",
  //                      "homepage": "tko-aly.com",
  //                      "size": 1
  //                  }
  //              ],
  //              "last_login": null,
  //              "username": "example_username",
  //              "email": "example_email@example.com",
  //              "telegram": "telegram",
  //              "role": 1
  //          },
  //          "responsible_for": "gary",
  //          "login_time": "2024-05-29T09:59:11.497510Z",
  //          "logout_time": "2024-05-30T09:59:11.497533Z",
  //          "present": true,
  //          "late": false,
  //          "created_by": "example_username"
  //      }
  //    ]}
  //    const responsedata = { data: [
  //      {
  //          "id": 1,
  //          "keys": [
  //              {
  //                  "id": 1,
  //                  "user_set": [
  //                      {
  //                          "id": 1,
  //                          "last_login": null,
  //                          "username": "example_username",
  //                          "email": "example_email@example.com",
  //                          "telegram": "telegram",
  //                          "role": 1,
  //                          "keys": [
  //                              1
  //                          ]
  //                      }
  //                  ],
  //                  "name": "example_org",
  //                  "email": "example@org.org",
  //                  "homepage": "example.org",
  //                  "size": 1
  //              }
  //          ],
  //          "last_login": null,
  //          "username": "example_username",
  //          "email": "example_email@example.com",
  //          "telegram": "telegram",
  //          "role": 1
  //      }
  //    ] };
  //
  //    await waitFor(() => {
  //    mockAxios.mockResponseFor({url: 'listobjects/nightresponsibilities/'}, response)
  //    mockAxios.mockResponseFor({url: 'undefined/api/users/userinfo'}, responsedata)
  //
  //      expect(mockAxios.get).toHaveBeenCalledWith('undefined/api/users/userinfo', {"headers": {"Authorization": "Bearer example_token"}})
  //      expect(mockAxios.get).toHaveBeenCalledWith('listobjects/nightresponsibilities/')
  //
  //      const filtermin = getByTestId("timefiltermin")
  //      const filtermax = getByTestId("timefiltermax")
  //      fireEvent.change(filtermin, { target: { value: "2024-05-28T01:00" } })
  //      fireEvent.change(filtermax, { target: { value: "2024-05-31T01:00" } })
  //
  //      expect(getByText("Vastuussa henkilöistä: gary")).toBeInTheDocument();
  //      expect(queryByText('Vastuussa henkilöistä: fuksit')).toBeNull()
  //    })
  //  })
});
