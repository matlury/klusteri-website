import { getCurrentDateTime, getTestTimes } from "../../src/utils/timehelpers";

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
    cy.url().should("include", "/christina_regina");
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
    cy.get('a[href="/christina_regina"] h1').click();
    cy.url().should("include", "/christina_regina");
  });

  it("error message if password input is too short", function () {
    cy.visit("http://localhost:5173/login");
    cy.wait(1000);
    cy.contains("Luo tili").click();
    cy.get("#usernameInput").type("testuser");
    cy.get("#passwordInput").type("s");
    cy.get("#confirmPasswordInput").type("s");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.contains("Luo tili").click();
    cy.contains("Salasanan tulee olla 8-20 merkkiä pitkä.");
  });

  it("error message if password input is too long", function () {
    cy.visit("http://localhost:5173/login");
    cy.contains("Luo tili").click();
    cy.contains("Telegram (valinnainen)"); //get
    cy.get("#usernameInput").type("testuser");
    cy.get("#passwordInput").type("1234567890salasanaaaaaaaa");
    cy.get("#confirmPasswordInput").type("1234567890salasanaaaaaaaa");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.contains("Luo tili").click();
    cy.contains("Salasanan tulee olla 8-20 merkkiä pitkä.");
  });

  it("error message if passwords dont match", function () {
    cy.visit("http://localhost:5173/login");
    cy.contains("Luo tili").click();
    cy.contains("Telegram (valinnainen)");
    cy.get("#usernameInput").type("testuser");
    cy.get("#passwordInput").type("salasana123");
    cy.get("#confirmPasswordInput").type("salasana234");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.contains("Luo tili").click();
    cy.contains("Salasanat eivät täsmää.");
  });

  it("error message if password only contains numbers", function () {
    cy.visit("http://localhost:5173/login");
    cy.contains("Luo tili").click();
    cy.contains("Telegram (valinnainen)");
    cy.get("#usernameInput").type("testuser");
    cy.get("#passwordInput").type("1234567890");
    cy.get("#confirmPasswordInput").type("1234567890");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.contains("Luo tili").click();
    cy.contains("Salasana ei saa sisältää pelkkiä numeroita tai kirjaimia.");
  });

  it("error message if a field is missing", function () {
    cy.visit("http://localhost:5173/login");
    cy.contains("Luo tili").click();
    cy.contains("Telegram (valinnainen)");
    cy.get("#passwordInput").type("1234567890");
    cy.get("#confirmPasswordInput").type("1234567890");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.contains("Luo tili").click();
    cy.contains(
      "Käyttäjänimi, salasana, sähköposti ja vahvista salasana ovat pakollisia kenttiä.",
    );
  });

  it("a user can be created", function () {
    cy.visit("http://localhost:5173/login");
    cy.contains("Luo tili").click();
    cy.contains("Telegram (valinnainen)");
    cy.get("#usernameInput").type("testuser");
    cy.get("#passwordInput").type("salasana123");
    cy.get("#confirmPasswordInput").type("salasana123");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.contains("Luo tili").click();
    cy.contains("Käyttäjä luotu onnistuneesti!");
  });

  it("a user can log in", function () {
    cy.on("uncaught:exception", () => {
      return false;
    });

    cy.contains("Kirjaudu").click();
    cy.contains("Luo tili").click();
    cy.contains("Telegram (valinnainen)");
    cy.get("#usernameInput").type("testuser");
    cy.get("#passwordInput").type("salasana123");
    cy.get("#confirmPasswordInput").type("salasana123");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.contains("Luo tili").click();

    cy.wait(500);
    cy.contains("Etusivu");

    cy.get("#email").type("testuser@gmail.com");
    cy.get("#password").type("salasana123");
    cy.contains("Kirjaudu sisään").click();
    //cy.contains("Hei testuser!");
  });
});

describe("Ownkeys", () => {
  beforeEach(function () {
    cy.request("POST", "http://localhost:8000/api/testing/reset");
    cy.visit("http://localhost:5173");
  });
  it("YKV-login in works", function () {
    cy.on("uncaught:exception", () => {
      return false;
    });
    const body = {
      username: "leppis",
      password: "salasana123",
      email: "pj@gmail.com",
      telegram: "pjtg",
      role: 1,
      keys: { "tko-äly": true },
      organization: { "tko-äly": true },
    };
    cy.request("POST", "http://localhost:8000/api/users/register", body).then(
      (response) => {
        expect(response.body).to.have.property("username", "leppis");
      },
    );
    cy.wait(1000);
    cy.contains("Kirjaudu").click();
    cy.get("#email").type("pj@gmail.com");
    cy.get("#password").type("salasana123");
    cy.get(".login-button").click();
    cy.wait(5000);
    cy.contains("Omat avaimet").click();
    cy.reload();
    //cy.get("#responsibility").type("fuksit");
    cy.contains("+ Ota vastuu").click();    // korjattu nämä vastaamaan todellisuutta
    cy.get("#responsibility").type("fuksit");  // lisätty
    cy.contains("Ota vastuu").click();  // lisätty
    cy.contains("Peruuta").click();    // että sulkee ikkunan, tilapäinen keino poistua pop-upista
    cy.reload();
    cy.contains("fuksit");
    //cy.contains("Vastuuhenkilö: leppis, pj@gmail.com");
    //cy.contains("Vastuussa henkilöistä: fuksit");
  });
//   it("YKV-logout works", function () {
//     cy.on("uncaught:exception", () => {
//       return false;
//     });
//     const body = {
//       username: "leppis",
//       password: "salasana123",
//       email: "pj@gmail.com",
//       telegram: "pjtg",
//       role: 1,
//       keys: { "tko-äly": true },
//       organization: { "tko-äly": true },
//     };
//     cy.request("POST", "http://localhost:8000/api/users/register", body).then(
//       (response) => {
//         expect(response.body).to.have.property("username", "leppis");
//       },
//     );
//     cy.wait(1000);
//     cy.contains("Kirjaudu").click();
//     cy.get("#email").type("pj@gmail.com");
//     cy.get("#password").type("salasana123");
//     cy.get(".login-button").click();
//     cy.wait(500);
//     cy.contains("Omat avaimet").click();
//     cy.reload();
//     cy.get("#responsibility").type("fuksit");
//     cy.contains("Ota vastuu").click();
//     cy.contains("YKV-uloskirjaus").click();
//     cy.contains("Select All").click();
//     cy.contains("Submit").click();
//     cy.contains("YKV-uloskirjaus onnistui");
//   });
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
    cy.contains("Kirjaudu").click();
    cy.get("#email").type("pj@gmail.com");
    cy.get("#password").type("salasana123");
    cy.get(".login-button").click();
    cy.wait(500);
    cy.contains("Omat tiedot").click();
    cy.contains("Käyttäjänimi");
    cy.contains("Sähköposti");
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
    cy.contains("Kirjaudu").click();
    cy.get("#email").type("pj@gmail.com");
    cy.get("#password").type("salasana123");
    cy.get(".login-button").click();
    cy.wait(500);
    cy.contains("Kirjaudu ulos").click();
    cy.wait(500);
    cy.contains("Kirjaudu");
  });
});

describe("Reservations", () => {
  beforeEach(function () {
    cy.request("POST", "http://localhost:8000/api/testing/reset");
    cy.visit("http://localhost:5173/varaukset");
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
    cy.contains("Kirjaudu").click();
    cy.get("#email").type("pj@gmail.com");
    cy.get("#password").type("salasana123");
    cy.get(".login-button").click();
    cy.wait(500);
    cy.contains("Varaukset").click();
    cy.contains("Varauskalenteri");
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
    cy.contains("Kirjaudu").click();
    cy.get("#email").type("pj@gmail.com");
    cy.get("#password").type("salasana123");
    cy.get(".login-button").click();
    cy.wait(500);
    cy.contains("Kirjaudu ulos").click();
    cy.wait(500);
    cy.contains("Kirjaudu");
  });

  describe("Creating and deleting", () => {
    beforeEach(function () {
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
      cy.contains("Kirjaudu").click();
      cy.get("#email").type("pj@gmail.com");
      cy.get("#password").type("salasana123");
      cy.get(".login-button").click();
      cy.wait(500);
      cy.contains("Varaukset").click();
    });
    it("Creating event works", function () {
      cy.get("#createEvent").click();
      const dates = getTestTimes();
      const checkdate = getCurrentDateTime();
      cy.get("#startTime").type(dates[0]);
      cy.get("#endTime").click().type(dates[1]);
      cy.get("#eventName").type("Test Event");
      cy.get("#organizerName").type("Tester Mann");
      cy.get("#responsibleName").type("Mr Responsible");
      cy.get("#eventDescription").type("This is a testing event");
      cy.get("#eventOpen").select("Avoin tapahtuma");
      cy.get("#eventRoom").select("Kokoushuone");
      cy.get("#confirmCreate").click();
      cy.wait(500);
      cy.contains("Test Event").click();
      cy.contains(checkdate);
      cy.contains("Test Event");
      cy.contains("Järjestäjä: Tester Mann");
      cy.contains("Vastuuhenkilö: Mr Responsible");
      cy.contains("Kuvaus: This is a testing event");
      cy.contains("Tila: Avoin");
      cy.contains("Huone: Kokoushuone");
    });
    it("Deleting event works", function () {
      const dates = getTestTimes();
      const body = {
        start: dates[0],
        end: dates[1],
        title: "Test Event 2",
        organizer: "Tester Mannen",
        description: "Testing event",
        responsible: "Mr Irresponsible",
        open: false,
        room: "Kerhotila",
      };
      const token = localStorage.getItem("ACCESS_TOKEN");
      cy.request({
        method: "POST",
        url: "http://localhost:8000/api/events/create_event",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      }).then((response) => {
        expect(response.body).to.have.property("title", "Test Event 2");
      });
      cy.reload();
      cy.contains("Test Event 2").then(() => {
        cy.contains("Test Event 2").click();
      });
      cy.wait(500);
      cy.get("#deleteEvent").click();
      cy.wait(500);
      cy.get("#closeEvent").click();
      cy.contains("Test Event 2").should("not.exist");
    });
  });
});

Cypress.on;
