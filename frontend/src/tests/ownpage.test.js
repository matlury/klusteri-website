import "@testing-library/jest-dom";
import { render, waitFor, fireEvent } from "@testing-library/react";
import OwnPage from "../pages/ownpage";
import mockAxios from "../../__mocks__/axios";
import i18n from "../i18n.js";

localStorage.setItem("lang", "fi")

afterEach(() => {
  mockAxios.reset();
});

beforeEach(() => {
  mockAxios.reset();
})

const user = {
  username: "example_username",
  email: "example_email@example.com",
  telegram: "example_telegram",
  role: 1,
};

localStorage.setItem("loggedUser", JSON.stringify(user));

describe("OwnPage Component", () => {
  it("opens without logging in", () => {
    localStorage.setItem("loggedUser", null);
    const { getByText } = render(<OwnPage isLoggedIn={false} />);
    expect(getByText("Kirjaudu sisään")).toBeInTheDocument();
  });
});

it("opens with role 5", () => {
  const user = {
    username: "example_username",
    email: "example_email@example.com",
    telegram: "example_telegram",
    role: 5,
  };
  localStorage.setItem("loggedUser", JSON.stringify(user));
  const { getByText, getByLabelText } = render(<OwnPage isLoggedIn={true} />);
  expect(getByLabelText("Käyttäjänimi")).toBeInTheDocument();
  expect(getByLabelText("Sähköposti")).toBeInTheDocument();
  expect(getByLabelText("Telegram")).toBeInTheDocument();
  expect(getByText("Käyttäjän rooli: 5")).toBeInTheDocument();
  expect(getByText("Tallenna")).toBeInTheDocument();
  expect(getByText("Järjestöt")).toBeInTheDocument();
});

// it("opens with role 1", async () => {
//   const user = {
//     username: "example_username",
//     email: "example_email@example.com",
//     telegram: "example_telegram",
//     role: 1,
//   };
//   localStorage.setItem("loggedUser", JSON.stringify(user));
//   localStorage.setItem("ACCESS_TOKEN", "example_token");
//   const { getByText, getByLabelText } = render(<OwnPage isLoggedIn={true} />);

//   let responseObj = {
//     data: [
//       {
//         id: 1,
//         keys: [
//           {
//             id: 1,
//             user_set: [
//               {
//                 id: 1,
//                 last_login: null,
//                 username: "example_username",
//                 email: "example_email@example.com",
//                 telegram: "telegram",
//                 role: 1,
//                 keys: [1],
//               },
//             ],
//             name: "example_org",
//             email: "example@org.org",
//             homepage: "example.org",
//             size: 1,
//           },
//         ],
//         last_login: null,
//         username: "example_username",
//         email: "example_email@example.com",
//         telegram: "telegram",
//         role: 1,
//       },
//     ],
//   };

//   await waitFor(() => {
//     mockAxios.mockResponseFor(
//       { url: "undefined/api/users/userinfo" },
//       responseObj,
//     );
//     expect(mockAxios.get).toHaveBeenCalledWith("undefined/api/users/userinfo", {
//       headers: { Authorization: "Bearer example_token" },
//     });
//     expect(getByLabelText("Käyttäjänimi")).toBeInTheDocument();
//     expect(getByLabelText("Sähköposti")).toBeInTheDocument();
//     expect(getByLabelText("Telegram")).toBeInTheDocument();
//     expect(getByText("Käyttäjän rooli: 1")).toBeInTheDocument();
//     expect(getByText("Tallenna")).toBeInTheDocument();
//     expect(getByText("Järjestöt")).toBeInTheDocument();
//     expect(getByText("Luo uusi järjestö")).toBeInTheDocument();
//     expect(getByText("Käyttäjät")).toBeInTheDocument();
//     expect(getByText("Avaimen luovutus")).toBeInTheDocument();
//   });
// });

it("User updating works", async () => {
  const user = {
    username: "example_username",
    email: "example_email@example.com",
    telegram: "example_telegram",
    role: 5,
    id: 1,
  };
  window.confirm = jest.fn(() => true);
  localStorage.setItem("ACCESS_TOKEN", "example_token");
  localStorage.setItem("loggedUser", JSON.stringify(user));
  const { getByText, getByLabelText, getByTestId } = render(
    <OwnPage isLoggedIn={true} />,
  );

  const username_field = getByLabelText("Käyttäjänimi");
  fireEvent.change(username_field, { target: { value: "username_example" } });

  const email_field = getByLabelText("Sähköposti");
  fireEvent.change(email_field, {
    target: { value: "email_example@example.com" },
  });

  const telegram_field = getByLabelText("Telegram");
  fireEvent.change(telegram_field, { target: { value: "telegram_example" } });

  const responseObj = { data: [
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
                            1,
                            2
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
    }, {
      "id": 2,
      "keys": [
          {
              "id": 2,
              "user_set": [
                  {
                      "id": 2,
                      "last_login": null,
                      "username": "example_username_two",
                      "email": "example_email_two@example.com",
                      "telegram": "example_telegram_two",
                      "role": 1,
                      "keys": [
                          2
                      ]
                  }
              ],
              "name": "matrix",
              "email": "matrix@aly.org",
              "homepage": "matrix.com",
              "size": 1
          }
      ],
      "last_login": null,
      "username": "example_username_two",
      "email": "example_email_two@example.com",
      "telegram": "example_telegram_two",
      "role": 1
  }
  ]}

  const resp_updated = { data : {
    "id": 1,
    "keys": [
        {
            "id": 1,
            "user_set": [
                {
                    "id": 1,
                    "last_login": null,
                    "username": "username_example",
                    "email": "email_example@example.com",
                    "telegram": "telegram_example",
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
    "username": "username_example",
    "email": "email_example@example.com",
    "telegram": "telegram_example",
    "role": 1
  }}

  const saveButton = getByTestId("saveuserdata");
  fireEvent.click(saveButton);

  await waitFor(() => {
    mockAxios.mockResponseFor(
      { url: "undefined/api/listobjects/users/?telegram=telegram_example" },
      responseObj,
    );})
  await waitFor(() => {
    mockAxios.mockResponseFor(
      { url: "undefined/api/listobjects/users/?email=email_example@example.com" },
      responseObj,
    );})
  await waitFor(() => {
    mockAxios.mockResponseFor(
      { url: "/users/update/1/" },
      resp_updated,
    )
  })
  await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith("undefined/api/listobjects/users/?telegram=telegram_example");
  })
  await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith("undefined/api/listobjects/users/?email=email_example@example.com");
  })
  await waitFor(() => {
    expect(mockAxios.put).toHaveBeenCalledWith("/users/update/1/", {"email": "email_example@example.com", "telegram": "telegram_example", "username": "username_example"});
  });
  await waitFor(() => {
    const successMessage = getByText((content, element) => {
      return element.tagName.toLowerCase() === 'p' && content.includes("Tiedot päivitetty onnistuneesti");
    });
    expect(successMessage).toBeInTheDocument();
  })
});

describe("User updating errors", () => {
  it("Updating fails with no username or email", async () => {
    const user = {
      username: "example_username",
      email: "example_email@example.com",
      telegram: "example_telegram",
      role: 5,
      id: 1,
    };
    window.confirm = jest.fn(() => true);
    localStorage.setItem("ACCESS_TOKEN", "example_token");
    localStorage.setItem("loggedUser", JSON.stringify(user));
    const { getByText, getByLabelText, getByTestId } = render(
      <OwnPage isLoggedIn={true} />,
    );

    const username_field = getByLabelText("Käyttäjänimi");
    fireEvent.change(username_field, { target: { value: "" } });

    const email_field = getByLabelText("Sähköposti");
    fireEvent.change(email_field, { target: { value: "" } });

    const saveButton = getByTestId("saveuserdata");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        getByText("Virhe: Käyttäjänimi ja sähköposti ovat pakollisia kenttiä."),
      ).toBeInTheDocument();
    });
  });

  it("Updating fails with used telegram", async () => {
    const user = {
      username: "example_username",
      email: "example_email@example.com",
      telegram: "example_telegram",
      role: 5,
      id: 1,
    };
    window.confirm = jest.fn(() => true);
    localStorage.setItem("ACCESS_TOKEN", "example_token");
    localStorage.setItem("loggedUser", JSON.stringify(user));
    const { getByText, getByLabelText, getByTestId } = render(
      <OwnPage isLoggedIn={true} />,
    );

    const telegram = getByLabelText("Telegram");
    fireEvent.change(telegram, { target: { value: "example_telegram_two" } });

    const responseObj = { data: [
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
                              1,
                              2
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
      }, {
        "id": 2,
        "keys": [
            {
                "id": 2,
                "user_set": [
                    {
                        "id": 2,
                        "last_login": null,
                        "username": "example_username_two",
                        "email": "example_email_two@example.com",
                        "telegram": "example_telegram_two",
                        "role": 1,
                        "keys": [
                            2
                        ]
                    }
                ],
                "name": "matrix",
                "email": "matrix@aly.org",
                "homepage": "matrix.com",
                "size": 1
            }
        ],
        "last_login": null,
        "username": "example_username_two",
        "email": "example_email_two@example.com",
        "telegram": "example_telegram_two",
        "role": 1
    }
    ]}

    const saveButton = getByTestId("saveuserdata");
    fireEvent.click(saveButton);

    await waitFor(() => {
    mockAxios.mockResponseFor(
      { url: "undefined/api/listobjects/users/?telegram=example_telegram_two" },
      responseObj,
    );})
    await waitFor(() => {
      const errorMessage = getByText((content, element) => {
        return element.tagName.toLowerCase() === 'p' && content.includes("Telegram on jo käytössä");
      });
      expect(errorMessage).toBeInTheDocument();
    })
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith("undefined/api/listobjects/users/?telegram=example_telegram_two");
    })
  })

  it("Update fails with used email", async () => {
    const user = {
      username: "example_username",
      email: "example_email@example.com",
      telegram: "example_telegram",
      role: 5,
      id: 1,
    };
    window.confirm = jest.fn(() => true);
    localStorage.setItem("ACCESS_TOKEN", "example_token");
    localStorage.setItem("loggedUser", JSON.stringify(user));
    const { getByText, getByLabelText, getByTestId } = render(
      <OwnPage isLoggedIn={true} />,
    );

    const email = getByLabelText("Sähköposti");
    fireEvent.change(email, { target: { value: "example_email_two@example.com" } });

    const responseObj = { data: [
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
                              1,
                              2
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
      }, {
        "id": 2,
        "keys": [
            {
                "id": 2,
                "user_set": [
                    {
                        "id": 2,
                        "last_login": null,
                        "username": "example_username_two",
                        "email": "example_email_two@example.com",
                        "telegram": "example_telegram_two",
                        "role": 1,
                        "keys": [
                            2
                        ]
                    }
                ],
                "name": "matrix",
                "email": "matrix@aly.org",
                "homepage": "matrix.com",
                "size": 1
            }
        ],
        "last_login": null,
        "username": "example_username_two",
        "email": "example_email_two@example.com",
        "telegram": "example_telegram_two",
        "role": 1
    }
    ]}

    const saveButton = getByTestId("saveuserdata");
    fireEvent.click(saveButton);

    await waitFor(() => {
    mockAxios.mockResponseFor(
      { url: "undefined/api/listobjects/users/?email=example_email_two@example.com" },
      responseObj,
    );})
    await waitFor(() => {
      const errorMessage = getByText((content, element) => {
        return element.tagName.toLowerCase() === 'p' && content.includes("Sähköposti on jo käytössä");
      });
      expect(errorMessage).toBeInTheDocument();
    })
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith("undefined/api/listobjects/users/?email=example_email_two@example.com");
    })
  })
});

// describe("Organizations", () => {
//   it("Organization view works", async () => {
//     const user = {
//       username: "example_username",
//       email: "example_email@example.com",
//       telegram: "example_telegram",
//       role: 1,
//       id: 1,
//     };
//     localStorage.setItem("ACCESS_TOKEN", "example_token");
//     localStorage.setItem("loggedUser", JSON.stringify(user));
//     const { getByText, getByLabelText, getByTestId } = render(
//       <OwnPage isLoggedIn={true} />,
//     );

//     const responseObj = {data: [  
//       {
//             "id": 1,
//             "user_set": [
//                 {
//                     "id": 1,
//                     "last_login": null,
//                     "username": "example_username",
//                     "email": "example_email@example.com",
//                     "telegram": "example_telegram",
//                     "role": 1,
//                     "keys": [
//                         1,
//                         2
//                     ]
//                 }
//             ],
//             "name": "tko-äly",
//             "email": "tko@aly.org",
//             "homepage": "tko-aly.com",
//             "size": 1
//         }
//       ]}

//     const resp = {data: {
//       "id": 1,
//       "keys": [
//           {
//               "id": 1,
//               "user_set": [
//                   {
//                       "id": 1,
//                       "last_login": null,
//                       "username": "example_username",
//                       "email": "example_email@example.com",
//                       "telegram": "example_telegram",
//                       "role": 1,
//                       "keys": [
//                           1,
//                           2
//                       ]
//                   }
//               ],
//               "name": "tko-äly",
//               "email": "tko@aly.org",
//               "homepage": "tko-aly.com",
//               "size": 1
//           },
//           {
//               "id": 2,
//               "user_set": [
//                   {
//                       "id": 2,
//                       "last_login": null,
//                       "username": "tavallinen",
//                       "email": "tavallinen@testi.com",
//                       "telegram": "tavallinen",
//                       "role": 4,
//                       "keys": [
//                           2
//                       ]
//                   },
//                   {
//                       "id": 1,
//                       "last_login": null,
//                       "username": "example_username",
//                       "email": "example_email@example.com",
//                       "telegram": "example_telegram",
//                       "role": 1,
//                       "keys": [
//                           1,
//                           2
//                       ]
//                   }
//               ],
//               "name": "matrix",
//               "email": "matrix@matrix-ry.fi",
//               "homepage": "matrix-ry.fi",
//               "size": 1
//           }
//       ],
//       "last_login": null,
//       "username": "example_username",
//       "email": "example_email@example.com",
//       "telegram": "example_telegram",
//       "password": "pbkdf2_sha256$720000$DLGzd60Wxi86fl0ALgPYyI$uZAvY+sTmSRrz/UdX6m1IKv3j2wy4hHz86TijOw+tt8=",
//       "role": 1
//       }}
      
//       mockAxios.mockResponseFor(
//         { url: "undefined/api/listobjects/organizations/" },
//         responseObj,
//       );
    
//       await waitFor(() => {
//       mockAxios.mockResponseFor(
//       { url: "undefined/api/users/userinfo" },
//       resp,
//       );
//         expect(mockAxios.get).toHaveBeenCalledWith("undefined/api/users/userinfo", { headers: { Authorization: "Bearer example_token" } });
//         expect(mockAxios.get).toHaveBeenCalledWith("undefined/api/listobjects/organizations/");
//       });

//       await waitFor(() => {
//         const viewButton = getByTestId("orgdetailsbutton");
//         fireEvent.click(viewButton);
//     })
//   })
// })
