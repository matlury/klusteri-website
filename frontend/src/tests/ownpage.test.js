import "@testing-library/jest-dom";
import {
  render,
  waitFor,
  fireEvent,
  within,
  screen,
} from "@testing-library/react";
import OwnPage from "../pages/ownpage";
import mockAxios from "../../__mocks__/axios";
import i18n from "../i18n.js";

localStorage.setItem("lang", "fi");

afterEach(() => {
  mockAxios.reset();
});

beforeEach(() => {
  mockAxios.reset();
});

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
  expect(getByLabelText("Salasana")).toBeInTheDocument();
  expect(getByLabelText("Vahvista salasana")).toBeInTheDocument();
  expect(getByLabelText("Sähköposti")).toBeInTheDocument();
  expect(getByLabelText("Telegram")).toBeInTheDocument();
  expect(getByText("Käyttäjän rooli: Tavallinen")).toBeInTheDocument();
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
    password: "example_password123",
    confirmPassword: "example_password123",
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

  const responseObj = {
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
                password: "",
                email: "example_email@example.com",
                confirmPassword: "",
                telegram: "example_telegram",
                role: 1,
                keys: [1, 2],
              },
            ],
            name: "tko-äly",
            email: "tko@aly.org",
            homepage: "tko-aly.com",
            size: 1,
          },
        ],
        last_login: null,
        username: "example_username",
        password: "",
        email: "example_email@example.com",
        confirmPassword: "",
        telegram: "example_telegram",
        role: 1,
      },
      {
        id: 2,
        keys: [
          {
            id: 2,
            user_set: [
              {
                id: 2,
                last_login: null,
                username: "example_username_two",
                password: "",
                email: "example_email_two@example.com",
                confirmPassword: "",
                telegram: "example_telegram_two",
                role: 1,
                keys: [2],
              },
            ],
            name: "matrix",
            email: "matrix@aly.org",
            homepage: "matrix.com",
            size: 1,
          },
        ],
        last_login: null,
        username: "example_username_two",
        password: "",
        email: "example_email_two@example.com",
        confirmPassword: "",
        telegram: "example_telegram_two",
        role: 1,
      },
    ],
  };

  const resp_updated = {
    data: {
      id: 1,
      keys: [
        {
          id: 1,
          user_set: [
            {
              id: 1,
              last_login: null,
              username: "username_example",
              password: "",
              email: "email_example@example.com",
              confirmPassword: "",
              telegram: "telegram_example",
              role: 1,
              keys: [1],
            },
          ],
          name: "tko-äly",
          email: "tko@aly.org",
          homepage: "tko-aly.com",
          size: 1,
        },
      ],
      last_login: null,
      username: "username_example",
      password: "",
      email: "email_example@example.com",
      confirmPassword: "",
      telegram: "telegram_example",
      role: 1,
    },
  };

  const saveButton = getByTestId("saveuserdata");
  fireEvent.click(saveButton);

  await waitFor(() => {
    mockAxios.mockResponseFor(
      { url: "undefined/api/listobjects/users/?telegram=telegram_example" },
      responseObj,
    );
  });
  await waitFor(() => {
    mockAxios.mockResponseFor(
      {
        url: "undefined/api/listobjects/users/?email=email_example@example.com",
      },
      responseObj,
    );
  });
  await waitFor(() => {
    mockAxios.mockResponseFor({ url: "/users/update/1/" }, resp_updated);
  });
  await waitFor(() => {
    expect(mockAxios.get).toHaveBeenCalledWith(
      "undefined/api/listobjects/users/?telegram=telegram_example",
    );
  });
  await waitFor(() => {
    expect(mockAxios.get).toHaveBeenCalledWith(
      "undefined/api/listobjects/users/?email=email_example@example.com",
    );
  });
  await waitFor(() => {
    expect(mockAxios.put).toHaveBeenCalledWith("/users/update/1/", {
      email: "email_example@example.com",
      password: "",
      telegram: "telegram_example",
      confirmPassword: "",
      username: "username_example",
    });
  });
  await waitFor(() => {
    const snackbar = getByTestId("snackbar");
    expect(snackbar).toBeInTheDocument();
    expect(within(snackbar).getByRole("alert")).toHaveClass(
      "MuiAlert-standardSuccess",
    );
  });
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
      const snackbar = getByTestId("snackbar");
      expect(snackbar).toBeInTheDocument();
      expect(within(snackbar).getByRole("alert")).toHaveClass(
        "MuiAlert-standardError",
      );
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

    const responseObj = {
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
                  telegram: "example_telegram",
                  role: 1,
                  keys: [1, 2],
                },
              ],
              name: "tko-äly",
              email: "tko@aly.org",
              homepage: "tko-aly.com",
              size: 1,
            },
          ],
          last_login: null,
          username: "example_username",
          email: "example_email@example.com",
          telegram: "example_telegram",
          role: 1,
        },
        {
          id: 2,
          keys: [
            {
              id: 2,
              user_set: [
                {
                  id: 2,
                  last_login: null,
                  username: "example_username_two",
                  email: "example_email_two@example.com",
                  telegram: "example_telegram_two",
                  role: 1,
                  keys: [2],
                },
              ],
              name: "matrix",
              email: "matrix@aly.org",
              homepage: "matrix.com",
              size: 1,
            },
          ],
          last_login: null,
          username: "example_username_two",
          email: "example_email_two@example.com",
          telegram: "example_telegram_two",
          role: 1,
        },
      ],
    };

    const saveButton = getByTestId("saveuserdata");
    fireEvent.click(saveButton);

    await waitFor(() => {
      mockAxios.mockResponseFor(
        {
          url: "undefined/api/listobjects/users/?telegram=example_telegram_two",
        },
        responseObj,
      );
    });
    await waitFor(() => {
      const snackbar = getByTestId("snackbar");
      expect(snackbar).toBeInTheDocument();
      expect(within(snackbar).getByRole("alert")).toHaveClass(
        "MuiAlert-standardError",
      );
    });
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith(
        "undefined/api/listobjects/users/?telegram=example_telegram_two",
      );
    });
  });

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
    fireEvent.change(email, {
      target: { value: "example_email_two@example.com" },
    });

    const responseObj = {
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
                  telegram: "example_telegram",
                  role: 1,
                  keys: [1, 2],
                },
              ],
              name: "tko-äly",
              email: "tko@aly.org",
              homepage: "tko-aly.com",
              size: 1,
            },
          ],
          last_login: null,
          username: "example_username",
          email: "example_email@example.com",
          telegram: "example_telegram",
          role: 1,
        },
        {
          id: 2,
          keys: [
            {
              id: 2,
              user_set: [
                {
                  id: 2,
                  last_login: null,
                  username: "example_username_two",
                  email: "example_email_two@example.com",
                  telegram: "example_telegram_two",
                  role: 1,
                  keys: [2],
                },
              ],
              name: "matrix",
              email: "matrix@aly.org",
              homepage: "matrix.com",
              size: 1,
            },
          ],
          last_login: null,
          username: "example_username_two",
          email: "example_email_two@example.com",
          telegram: "example_telegram_two",
          role: 1,
        },
      ],
    };

    const saveButton = getByTestId("saveuserdata");
    fireEvent.click(saveButton);

    await waitFor(() => {
      mockAxios.mockResponseFor(
        {
          url: "undefined/api/listobjects/users/?email=example_email_two@example.com",
        },
        responseObj,
      );
    });
    await waitFor(() => {
      const snackbar = getByTestId("snackbar");
      expect(snackbar).toBeInTheDocument();
      expect(within(snackbar).getByRole("alert")).toHaveClass(
        "MuiAlert-standardError",
      );
    });
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith(
        "undefined/api/listobjects/users/?email=example_email_two@example.com",
      );
    });
  });
});

describe("Organizations", () => {
  it("Organization creating works", async () => {
    const user = {
      username: "leppis",
      email: "leppis@testi.com",
      telegram: "",
      role: 1,
      id: 1,
    };
    localStorage.setItem("ACCESS_TOKEN", "example_token");
    localStorage.setItem("loggedUser", JSON.stringify(user));
    const { getByText, getByLabelText, getByTestId } = render(
      <OwnPage isLoggedIn={true} />,
    );

    const responseObj = {
      data: [
        {
          id: 1,
          keys: [],
          last_login: null,
          username: "leppis",
          email: "leppis@testi.com",
          telegram: "",
          role: 1,
          rights_for_reservation: false,
          password:
            "pbkdf2_sha256$720000$59HfEsJBpE0mRjEioNCe4t$UPY39IbZDP4/QNry7oH4b87/JF4IfTQSrVia4zpV7jc=",
        },
      ],
    };

    const resp = {
      data: {
        id: 2,
        user_set: [],
        name: "tko-aly",
        email: "tko@aly.com",
        homepage: "tko-aly.org",
        color: "",
      },
    };

    await waitFor(() => {
      mockAxios.mockResponseFor(
        { url: "undefined/api/users/userinfo" },
        responseObj,
      );
    });

    await waitFor(
      async () => {
        expect(mockAxios.get).toHaveBeenCalledWith(
          "undefined/api/users/userinfo",
          { headers: { Authorization: "Bearer example_token" } },
        );

        const createForm = getByTestId("createneworgbutton");
        fireEvent.click(createForm);

        const modal = within(await screen.findByRole("dialog"));

        expect(modal.getByText("Peruuta")).toBeInTheDocument();

        const name = modal
          .getByTestId("organization-name")
          .querySelector("input");
        await fireEvent.change(name, { target: { value: "tko-aly" } });

        const email = modal
          .getByTestId("organization-email")
          .querySelector("input");
        await fireEvent.change(email, { target: { value: "tko@aly.com" } });

        const homepage = modal
          .getByTestId("organization-homepage")
          .querySelector("input");
        await fireEvent.change(homepage, { target: { value: "tko-aly.org" } });

        const submit = modal.getByText("Luo järjestö");
        fireEvent.click(submit);

        mockAxios.mockResponseFor(
          { url: "undefined/api/listobjects/organizations/?email=tko@aly.com" },
          {
            data: [
              {
                id: 1,
                user_set: [],
                name: "matrix",
                email: "mat@rix.com",
                homepage: "matrix.org",
                color: "",
              },
            ],
          },
        );

        expect(mockAxios.get).toHaveBeenCalledWith(
          "undefined/api/listobjects/organizations/?email=tko@aly.com",
        );
        mockAxios.mockResponseFor({ url: "organizations/create" }, resp);

        expect(mockAxios.post).toHaveBeenCalledWith("organizations/create", {
          color: "",
          email: "tko@aly.com",
          homepage: "tko-aly.org",
          name: "tko-aly",
        });
        await waitFor(() => {
          const snackbar = getByTestId("snackbar");
          expect(snackbar).toBeInTheDocument();
//          expect(within(snackbar).getByRole("alert")).toHaveClass(
//            "MuiAlert-standardSuccess",
//          );
        });
      },
      { timeout: 10000 },
    );
  }, 20 * 1000);
});
