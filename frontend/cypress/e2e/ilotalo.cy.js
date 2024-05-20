describe("Frontpage", () => {
  beforeEach(function () {
    //Reset the testing database
    cy.request("POST", "http://localhost:8000/api/testing/reset");
    cy.visit("http://localhost:5173");
  });

  it("frontpage can be accessed", function () {
    cy.contains("Ilotalo");
    cy.contains("”sub hoc tecto cives academici excoluntur”?");
  });

  it("Navigates to Christina Regina page when the link is clicked", function () {
    cy.contains("Christina Regina").click();
    cy.url().should("include", "/christinaregina");
  });

  it("rules and instructions can be accessed", function () {
    cy.contains("Säännöt ja ohjeet").click();
    cy.url().should("include", "/saannot_ja_ohjeet");
    cy.contains("Säännöt ja ohjeet");
  });

  it("privacy policy can be accessed", function () {
    cy.contains("Tietosuojaseloste").click();
    cy.url().should("include", "/tietosuojaseloste");
    cy.contains(
      "Tämä on EU:n yleisen tietosuoja-asetuksen mukainen rekisteri- ja tietosuojaseloste.",
    );
    cy.contains("Rekisterinpitäjä");
  });

  it("contacts page can be accessed and christina regina page can be rendered", function () {
    cy.contains("Yhteystiedot").click();
    cy.url().should("include", "/yhteystiedot");
    cy.contains("Domus Gaudium");
    cy.contains("Klusterikännykkä");
    cy.get('a[href="/christinaregina"] h1').click();
    cy.url().should("include", "/christinaregina");
  });

  it("error message if password input is too short", function () {
    cy.contains("Luo uusi käyttäjä").click();
    cy.contains("Telegram (valinnainen):");
    cy.get("#usernameInput").type("testuser");
    cy.get("#passwordInput").type("s");
    cy.get("#confirmPasswordInput").type("s");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.contains("Luo käyttäjä").click();
    cy.contains("Salasanan tulee olla 8-20 merkkiä pitkä.");
  });

  it("error message if password input is too long", function () {
    cy.contains("Luo uusi käyttäjä").click();
    cy.contains("Telegram (valinnainen):");
    cy.get("#usernameInput").type("testuser");
    cy.get("#passwordInput").type("1234567890salasanaaaaaaaa");
    cy.get("#confirmPasswordInput").type("1234567890salasanaaaaaaaa");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.contains("Luo käyttäjä").click();
    cy.contains("Salasanan tulee olla 8-20 merkkiä pitkä.");
  });

  it("error message if passwords dont match", function () {
    cy.contains("Luo uusi käyttäjä").click();
    cy.contains("Telegram (valinnainen):");
    cy.get("#usernameInput").type("testuser");
    cy.get("#passwordInput").type("salasana123");
    cy.get("#confirmPasswordInput").type("salasana234");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.contains("Luo käyttäjä").click();
    cy.contains("Salasanat eivät täsmää.");
  });

  it("error message if password only contains numbers", function () {
    cy.contains("Luo uusi käyttäjä").click();
    cy.contains("Telegram (valinnainen):");
    cy.get("#usernameInput").type("testuser");
    cy.get("#passwordInput").type("1234567890");
    cy.get("#confirmPasswordInput").type("1234567890");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.contains("Luo käyttäjä").click();
    cy.contains("Salasana ei saa sisältää pelkkiä numeroita tai kirjaimia.");
  });

  it("error message if a field is missing", function () {
    cy.contains("Luo uusi käyttäjä").click();
    cy.contains("Telegram (valinnainen):");
    cy.get("#passwordInput").type("1234567890");
    cy.get("#confirmPasswordInput").type("1234567890");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.contains("Luo käyttäjä").click();
    cy.contains(
      "Käyttäjänimi, salasana, sähköposti ja vahvista salasana ovat pakollisia kenttiä.",
    );
  });

  it("a user can be created", function () {
    cy.contains("Luo uusi käyttäjä").click();
    cy.contains("Telegram (valinnainen):");
    cy.get("#usernameInput").type("testuser");
    cy.get("#passwordInput").type("salasana123");
    cy.get("#confirmPasswordInput").type("salasana123");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.contains("Luo käyttäjä").click();
    cy.contains("Käyttäjä luotu onnistuneesti!");
  });

  it("a user can log in", function () {
    cy.on("uncaught:exception", () => {
      return false;
    });

    cy.contains("Luo uusi käyttäjä").click();
    cy.contains("Telegram (valinnainen):");
    cy.get("#usernameInput").type("testuser");
    cy.get("#passwordInput").type("salasana123");
    cy.get("#confirmPasswordInput").type("salasana123");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.contains("Luo käyttäjä").click();

    cy.wait(500);
    cy.contains("Etusivu").click();

    cy.get("#email").type("testuser@gmail.com");
    cy.get("#password").type("salasana123");
    cy.contains("Kirjaudu sisään").click();
    cy.contains("Hei testuser!");
  });
});

describe("Ownkeys", () => {
  beforeEach(function () {
    cy.request("POST", "http://localhost:8000/api/testing/reset");
    cy.visit("http://localhost:5173");
  });

  it("logging in works", function () {
    cy.on("uncaught:exception", () => {
      return false;
    });

    const body = {
      username: "leppis",
      password: "salasana123",
      email: "pj@gmail.com",
      telegram: "pjtg",
      role: 1,
      keys: null,
      organization: null,
    };

    cy.request("POST", "http://localhost:8000/api/users/register", body).then(
      (response) => {
        expect(response.body).to.have.property("username", "leppis");
      },
    );

    cy.wait(1000);

    cy.get("#email").type("pj@gmail.com");
    cy.get("#password").type("salasana123");
    cy.get(".login-button").click();

    cy.wait(500);
    cy.contains("Hei leppis!");
    cy.contains("Omat avaimet").click();
    cy.reload()

    cy.get("#responsibility").type("fuksit");
    cy.contains("Ota vastuu").click();

    cy.contains("Vastuuhenkilö: leppis, pj@gmail.com");
    cy.contains("Vastuussa henkilöistä: fuksit");
  });

  it("YKV-logout works", function () {
    cy.on("uncaught:exception", () => {
      return false;
    });

    const body = {
      username: "leppis",
      password: "salasana123",
      email: "pj@gmail.com",
      telegram: "pjtg",
      role: 1,
      keys: null,
      organization: null,
    };

    cy.request("POST", "http://localhost:8000/api/users/register", body).then(
      (response) => {
        expect(response.body).to.have.property("username", "leppis");
      },
    );

    cy.wait(1000);
    cy.get("#email").type("pj@gmail.com");
    cy.get("#password").type("salasana123");
    cy.get(".login-button").click();

    cy.wait(500);
    cy.contains("Hei leppis!");
    cy.contains("Omat avaimet").click();
    cy.reload()

    cy.get("#responsibility").type("fuksit");
    cy.contains("Ota vastuu").click();

    cy.contains("YKV-uloskirjaus").click();
    cy.contains("Select All").click();
    cy.contains("Submit").click();
    cy.contains("YKV-uloskirjaus onnistui");
  });
});

describe("Ownpage", () => {
  beforeEach(function () {
    cy.request("POST", "http://localhost:8000/api/testing/reset");
    cy.visit("http://localhost:5173/omat_tiedot");
  });

  it("logging in works", function () {
    cy.on("uncaught:exception", () => {
      return false;
    });

    const body = {
      username: "leppis",
      password: "salasana123",
      email: "pj@gmail.com",
      telegram: "pjtg",
      role: 1,
      keys: null,
      organization: null,
    };

    cy.request("POST", "http://localhost:8000/api/users/register", body).then(
      (response) => {
        expect(response.body).to.have.property("username", "leppis");
      },
    );

    cy.wait(1000);

    cy.get("#email").type("pj@gmail.com");
    cy.get("#password").type("salasana123");
    cy.get(".login-button").click();

    cy.wait(500);
    cy.contains("Hei leppis!");

    cy.contains("Käyttäjänimi:");
    cy.contains("Sähköposti:");
    cy.contains("Järjestöt");
  });

  it("logging out works", function () {
    cy.on("uncaught:exception", () => {
      return false;
    });

    const body = {
      username: "leppis",
      password: "salasana123",
      email: "pj@gmail.com",
      telegram: "pjtg",
      role: 1,
      keys: null,
      organization: null,
    };

    cy.request("POST", "http://localhost:8000/api/users/register", body).then(
      (response) => {
        expect(response.body).to.have.property("username", "leppis");
      },
    );

    cy.wait(1000);

    cy.get("#email").type("pj@gmail.com");
    cy.get("#password").type("salasana123");
    cy.get(".login-button").click();

    cy.wait(500);
    cy.contains("Hei leppis!");

    cy.contains("Kirjaudu ulos").click();
    cy.wait(500);

    cy.contains("Kirjaudu sisään");
  });
});

Cypress.on;
