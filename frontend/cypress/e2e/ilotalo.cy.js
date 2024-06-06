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
    };
    let user_id;
    cy.request("POST", "http://localhost:8000/api/users/register", body).then(
      (response) => {
        user_id = response.body.id;
        expect(response.body).to.have.property("username", "leppis");
      },
    );
    cy.wait(1000);
    cy.contains("Kirjaudu").click();
    cy.get("#email").type("pj@gmail.com");
    cy.get("#password").type("salasana123");
    cy.get(".login-button").click();

    cy.window()
      .its("localStorage")
      .invoke("getItem", "ACCESS_TOKEN")
      .should("not.be.null")
      .then((token) => {
        const req = {
          email: "sahkoposti@tko-aly.fi",
          homepage: "tko-aly.fi",
          name: "tko-äly",
          size: "1",
        };

        cy.request({
          method: "POST",
          url: "http://localhost:8000/api/organizations/create",
          body: req,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          expect(response.body).to.have.property("name", "tko-äly");
        });
      });

    cy.window()
      .its("localStorage")
      .invoke("getItem", "ACCESS_TOKEN")
      .should("not.be.null")
      .then((token) => {
        const request = {
          organization_name: "tko-äly",
        };

        cy.request({
          method: "PUT",
          url: `http://localhost:8000/api/keys/hand_over_key/${user_id}/`,
          body: request,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          expect(response.body).to.have.property("id", user_id);
        });
      });

    cy.contains("Omat avaimet").click();
    cy.contains("+ Ota vastuu").click();
    cy.get("#responsibility").type("fuksit");
    cy.get("#takeresp").click();
    cy.contains("Peruuta").click();
    cy.reload();
    cy.contains("fuksit");
    cy.contains("leppis");
    cy.contains("fuksit");
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
    };
    let user_id;
    cy.request("POST", "http://localhost:8000/api/users/register", body).then(
      (response) => {
        user_id = response.body.id;
        expect(response.body).to.have.property("username", "leppis");
      },
    );
    cy.wait(1000);
    cy.contains("Kirjaudu").click();
    cy.get("#email").type("pj@gmail.com");
    cy.get("#password").type("salasana123");
    cy.get(".login-button").click();

    cy.window()
      .its("localStorage")
      .invoke("getItem", "ACCESS_TOKEN")
      .should("not.be.null")
      .then((token) => {
        const req = {
          email: "sahkoposti@tko-aly.fi",
          homepage: "tko-aly.fi",
          name: "tko-äly",
          size: "1",
        };

        cy.request({
          method: "POST",
          url: "http://localhost:8000/api/organizations/create",
          body: req,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          expect(response.body).to.have.property("name", "tko-äly");
        });
      });

    cy.window()
      .its("localStorage")
      .invoke("getItem", "ACCESS_TOKEN")
      .should("not.be.null")
      .then((token) => {
        const request = {
          organization_name: "tko-äly",
        };

        cy.request({
          method: "PUT",
          url: `http://localhost:8000/api/keys/hand_over_key/${user_id}/`,
          body: request,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          expect(response.body).to.have.property("id", user_id);
        });
      });

    cy.contains("Omat avaimet").click();
    cy.reload();
    cy.contains("+ Ota vastuu").click();
    cy.get("#responsibility").type("fuksit");
    cy.get("#takeresp").click();
    cy.reload();
    cy.get("#removeresp").click();
    cy.get("#confirmlogout").click();
    cy.contains("YKV-uloskirjaus onnistui");
  });
});

describe("Reservations", () => {
  beforeEach(function () {
    cy.request("POST", "http://localhost:8000/api/testing/reset");
    cy.visit("http://localhost:5173/varaukset");
  });

  describe("Creating and deleting", () => {
    beforeEach(function () {
      cy.viewport(2560, 1440);
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
      cy.get("#eventOpen").click();
      cy.contains("Avoin tapahtuma").click();
      cy.get("#eventRoom").click();
      cy.contains("Kokoushuone").click();
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


describe("Ownpage", () => {
  beforeEach(function () {
    cy.request("POST", "http://localhost:8000/api/testing/reset");
    cy.visit("http://localhost:5173/");
  });

  it("Changing own details works", function () {
    cy.on("uncaught:exception", () => {
      return false;
    });
    const body = {
      username: "proffa",
      password: "salasana123",
      email: "proffa@gmail.com",
      telegram: "",
      role: 5,
    };
    let user_id;
    cy.request("POST", "http://localhost:8000/api/users/register", body).then(
      (response) => {
        user_id = response.body.id;
        expect(response.body).to.have.property("username", "proffa");
      },
    );
    cy.wait(1000);
    cy.contains("Kirjaudu").click();
    cy.get("#email").type("proffa@gmail.com");
    cy.get("#password").type("salasana123");
    cy.get(".login-button").click();
    cy.contains("Talon latinankielinen nimi");

    cy.wait(500);
    cy.contains("Omat tiedot").click();

    cy.get("#telegram").type("ProffaTG");
    cy.contains("Tallenna").click();
    cy.contains("Onnistui: Tiedot päivitetty onnistuneesti!");

    });

  it("Create new organization works", function () {
    cy.on("uncaught:exception", () => {
      return false;
    });
    const body = {
      username: "super_prof",
      password: "salasana123",
      email: "super@gmail.com",
      telegram: "",
      role: 1,
    };
    let user_id;
    cy.request("POST", "http://localhost:8000/api/users/register", body).then(
      (response) => {
        user_id = response.body.id;
        expect(response.body).to.have.property("username", "super_prof");
      },
    );
    cy.wait(1000);
    cy.contains("Kirjaudu").click();
    cy.get("#email").type("super@gmail.com");
    cy.get("#password").type("salasana123");
    cy.get(".login-button").click();
    cy.contains("Talon latinankielinen nimi");

    cy.wait(500);
    cy.contains("Omat tiedot").click();

    cy.get("#name").type("Teekkarit");
    cy.get(".organization-email").type("teekkarit@mail.com");
    cy.get("#homepage").type("www.teekkarit.fi");
    cy.contains("Luo järjestö").click();
    cy.contains("Onnistui: Järjestö luotu onnistuneesti!");
    cy.contains("Teekkarit (avaimia: 0)");

    });

  })

describe("Statistics page", () => {
  beforeEach(function () {
     cy.request("POST", "http://localhost:8000/api/testing/reset");
     cy.visit("http://localhost:5173/");
   });
 
  it("Statistics don't render with role 5", function () {
    cy.on("uncaught:exception", () => {
      return false;
    });
    const body = {
      username: "proffa",
      password: "salasana123",
      email: "proffa@gmail.com",
      telegram: "",
      role: 5,
    };
    let user_id;
    cy.request("POST", "http://localhost:8000/api/users/register", body).then(
      (response) => {
        user_id = response.body.id;
        expect(response.body).to.have.property("username", "proffa");
      },
    );
    cy.wait(1000);
    cy.contains("Kirjaudu").click();
    cy.get("#email").type("proffa@gmail.com");
    cy.get("#password").type("salasana123");
    cy.get(".login-button").click();
    cy.contains("Tilastot").click();
    cy.contains("Kirjaudu sisään")
  })

  it("Statistics render with role 1", function () {
    cy.on("uncaught:exception", () => {
      return false;
    });
    const body = {
      username: "milhouse",
      password: "salasana123",
      email: "milhouse@gmail.com",
      telegram: "",
      role: 1,
    };
    let user_id;
    cy.request("POST", "http://localhost:8000/api/users/register", body).then(
      (response) => {
        user_id = response.body.id;
        expect(response.body).to.have.property("username", "milhouse");
      },
    );
    cy.wait(1000);
    cy.contains("Kirjaudu").click();
    cy.get("#email").type("milhouse@gmail.com");
    cy.get("#password").type("salasana123");
    cy.get(".login-button").click();
    cy.wait(500)
    cy.reload();
    cy.wait(500)
    cy.contains("Tilastot").click();
    cy.contains("YKV-kirjausten määrä järjestöittäin")
  })
  



})

Cypress.on;
  