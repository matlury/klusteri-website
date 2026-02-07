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
import { ContextProvider } from "../../src/context/ContextProvider";

localStorage.setItem("lang", "fi");

afterEach(() => {
  mockAxios.reset();
  localStorage.clear();
});

beforeEach(() => {
  mockAxios.reset();
  localStorage.clear();
});

describe("OwnPage Component", () => {
  it("opens without logging in", () => {
    const { getByText } = render(
      <ContextProvider>
        <OwnPage isLoggedIn={false} />
      </ContextProvider>
    );
    expect(getByText("Kirjaudu sisään")).toBeInTheDocument();
  });
});

it("opens with role 5", async () => {
  const user = {
    username: "example_username",
    email: "example_email@example.com",
    telegram: "example_telegram",
    role: 5,
  };
  localStorage.setItem("loggedUser", JSON.stringify(user));
  localStorage.setItem("ACCESS_TOKEN", "example_token");

  const { getByText, getByLabelText } = render(
    <ContextProvider>
      <OwnPage isLoggedIn={true} />
    </ContextProvider>
  );

  // Mock initial requests
  await waitFor(() => {
    mockAxios.mockResponseFor({ url: "users/userinfo" }, { data: user });
  });
  await waitFor(() => {
    mockAxios.mockResponseFor({ url: "listobjects/organizations/?include_user_count=true" }, { data: [] });
  });
  await waitFor(() => {
    mockAxios.mockResponseFor({ url: "listobjects/users/" }, { data: [] });
  });

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

  const { getByLabelText, getByTestId } = render(
    <ContextProvider>
      <OwnPage isLoggedIn={true} />
    </ContextProvider>
  );

  // Mock initial requests
  await waitFor(() => {
    mockAxios.mockResponseFor({ url: "users/userinfo" }, { data: user });
  });
  await waitFor(() => {
    mockAxios.mockResponseFor({ url: "listobjects/organizations/?include_user_count=true" }, { data: [] });
  });
  await waitFor(() => {
    mockAxios.mockResponseFor({ url: "listobjects/users/" }, { data: [] });
  });

  const username_field = getByLabelText("Käyttäjänimi");
  fireEvent.change(username_field, { target: { value: "username_example" } });

  const email_field = getByLabelText("Sähköposti");
  fireEvent.change(email_field, {
    target: { value: "email_example@example.com" },
  });

  const telegram_field = getByLabelText("Telegram");
  fireEvent.change(telegram_field, { target: { value: "telegram_example" } });

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

  await waitFor(() => expect(mockAxios.put).toHaveBeenCalled());
  mockAxios.mockResponse(resp_updated);

  await waitFor(() => {
    expect(mockAxios.put).toHaveBeenCalledWith("users/update/1/", {
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

    const { getByLabelText, getByTestId } = render(
      <ContextProvider>
        <OwnPage isLoggedIn={true} />
      </ContextProvider>
    );

    // Mock initial requests
    await waitFor(() => {
      mockAxios.mockResponseFor({ url: "users/userinfo" }, { data: user });
    });
    await waitFor(() => {
      mockAxios.mockResponseFor({ url: "listobjects/organizations/?include_user_count=true" }, { data: [] });
    });
    await waitFor(() => {
      mockAxios.mockResponseFor({ url: "listobjects/users/" }, { data: [] });
    });

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

    const { getByLabelText, getByTestId } = render(
      <ContextProvider>
        <OwnPage isLoggedIn={true} />
      </ContextProvider>
    );

    // Mock initial requests
    await waitFor(() => {
      mockAxios.mockResponseFor({ url: "users/userinfo" }, { data: user });
    });
    await waitFor(() => {
      mockAxios.mockResponseFor({ url: "listobjects/organizations/?include_user_count=true" }, { data: [] });
    });
    await waitFor(() => {
      mockAxios.mockResponseFor({ url: "listobjects/users/" }, { data: [] });
    });

    const telegram = getByLabelText("Telegram");
    fireEvent.change(telegram, { target: { value: "example_telegram_two" } });

    const saveButton = getByTestId("saveuserdata");
    fireEvent.click(saveButton);

    await waitFor(() => expect(mockAxios.put).toHaveBeenCalled());
    mockAxios.mockError({
      response: {
        status: 400,
        data: { telegram: ["Telegram is already in use"] }
      }
    });

    await waitFor(() => {
      const snackbar = getByTestId("snackbar");
      expect(snackbar).toBeInTheDocument();
      expect(within(snackbar).getByRole("alert")).toHaveClass(
        "MuiAlert-standardError",
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

    const { getByTestId } = render(
      <ContextProvider>
        <OwnPage isLoggedIn={true} />
      </ContextProvider>
    );

    // Mock 3 initial requests for role 1 (register mocks sequentially)
    await waitFor(() => {
      mockAxios.mockResponseFor({ url: "listobjects/organizations/?include_user_count=true" }, { data: [] });
    });
    await waitFor(() => {
      mockAxios.mockResponseFor({ url: "listobjects/users/" }, { data: [] });
    });
    await waitFor(() => {
      mockAxios.mockResponseFor({ url: "users/userinfo" }, { data: user });
    });

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

    await waitFor(
      async () => {
        expect(mockAxios.get).toHaveBeenCalledWith("users/userinfo");

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
          { url: "listobjects/organizations/?email=tko@aly.com" },
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
          "listobjects/organizations/?email=tko@aly.com",
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
