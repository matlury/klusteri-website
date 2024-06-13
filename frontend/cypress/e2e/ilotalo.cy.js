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
    cy.contains("Kirjaudu").click();
    cy.wait(1000);
    cy.contains("Luo tili").click();
    cy.get("#usernameInput").type("testuser");
    cy.get("#passwordInput").type("s");
    cy.get("#confirmPasswordInput").type("s");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.get(".create-user-button").click();
    cy.contains("Salasanan tulee olla 8-20 merkkiä pitkä.");
  });

  it("error message if password input is too long", function () {
    cy.contains("Kirjaudu").click();
    cy.contains("Luo tili").click();
    cy.contains("Telegram (valinnainen)"); //get
    cy.get("#usernameInput").type("testuser");
    cy.get("#passwordInput").type("1234567890salasanaaaaaaaa");
    cy.get("#confirmPasswordInput").type("1234567890salasanaaaaaaaa");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.get(".create-user-button").click();

    cy.contains("Salasanan tulee olla 8-20 merkkiä pitkä.");
  });

  it("error message if passwords dont match", function () {
    cy.contains("Kirjaudu").click();
    cy.contains("Luo tili").click();
    cy.contains("Telegram (valinnainen)");
    cy.get("#usernameInput").type("testuser");
    cy.get("#passwordInput").type("salasana123");
    cy.get("#confirmPasswordInput").type("salasana234");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.get(".create-user-button").click();
    cy.contains("Salasanat eivät täsmää.");
  });

  it("error message if password only contains numbers", function () {
    cy.contains("Kirjaudu").click();
    cy.contains("Luo tili").click();
    cy.contains("Telegram (valinnainen)");
    cy.get("#usernameInput").type("testuser");
    cy.get("#passwordInput").type("1234567890");
    cy.get("#confirmPasswordInput").type("1234567890");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.get(".create-user-button").click();
    cy.contains("Salasana ei saa sisältää pelkkiä numeroita tai kirjaimia.");
  });

  it("error message if a field is missing", function () {
    cy.contains("Kirjaudu").click();
    cy.contains("Luo tili").click();
    cy.contains("Telegram (valinnainen)");
    cy.get("#passwordInput").type("1234567890");
    cy.get("#confirmPasswordInput").type("1234567890");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.get(".create-user-button").click();
    cy.contains(
      "Käyttäjänimi, salasana, sähköposti ja vahvista salasana ovat pakollisia kenttiä.",
    );
  });

  it("a user can be created", function () {
    cy.contains("Kirjaudu").click();
    cy.contains("Luo tili").click();
    cy.contains("Telegram (valinnainen)");
    cy.get("#usernameInput").type("testuser");
    cy.get("#passwordInput").type("salasana123");
    cy.get("#confirmPasswordInput").type("salasana123");
    cy.get("#emailInput").type("testuser@gmail.com");
    cy.get("#telegramInput").type("testtg");
    cy.get(".create-user-button").click();
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
    cy.get(".create-user-button").click();
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

    cy.contains("YKV").click();
    cy.contains("+ Ota vastuu").click();
    cy.get("#responsibility").type("fuksit");
    cy.get("#takeresp").click();
    cy.wait(500);
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

    cy.contains("YKV").click();
    cy.reload();
    cy.contains("+ Ota vastuu").click();
    cy.get("#responsibility").type("fuksit");
    cy.wait(500);
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
    let org_id;
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
      cy.reload();
      cy.window()
        .its("localStorage")
        .invoke("getItem", "ACCESS_TOKEN")
        .should("not.be.null")
        .then((token) => {
          const req = {
            email: "sahkoposti@tko-aly.fi",
            homepage: "tko-aly.fi",
            name: "tko-äly",
            color: "",
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
            org_id = response.body.id;
          });
        });
      cy.contains("Varaukset").click();
      cy.reload();
    });
    it("Creating event works", function () {
      cy.get("#createEvent").click();
      const dates = getTestTimes();
      const checkdate = getCurrentDateTime();
      cy.get("#startTime").type(dates[0]);
      cy.get("#endTime").click().type(dates[1]);
      cy.get("#eventName").type("Test Event");
      cy.get("#organizerName").click();
      cy.contains("tko-äly").click();
      cy.get("#responsibleName").type("Mr Responsible");
      cy.get("#eventDescription").type("This is a testing event");
      cy.get("#eventOpen").click();
      cy.contains("Avoin tapahtuma").click();
      cy.get("#eventRoom").click();
      cy.contains("Kokoushuone").click();
      cy.get("#confirmCreate").click();
      cy.wait(500);
      cy.reload();
      cy.contains("Test Event").click();
      cy.contains(checkdate);
      cy.contains("Test Event");
      cy.contains("Järjestäjä: tko-äly");
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
        organizer: org_id,
        description: "Testing event",
        responsible: "Mr Irresponsible",
        open: false,
        room: "Kerhotila",
      };
      const token = localStorage.getItem("ACCESS_TOKEN");
      cy.wrap(null).then(() => {
        expect(org_id).to.exist;
        cy.log("Organization ID:", org_id);
      });
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
    cy.contains("Hallinnointi").click();

    cy.get("#telegram").type("ProffaTG");
    cy.contains("Tallenna").click();
    cy.contains("Onnistui: Tiedot päivitetty onnistuneesti!");
  });

  it("Create new organization works for permitted users", function () {
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
    cy.contains("Hallinnointi").click();

    cy.get("#name").type("Teekkarit");
    cy.get(".organization-email").type("teekkarit@mail.com");
    cy.get("#homepage").type("www.teekkarit.fi");
    cy.get("[data-testid=create-organization-button]").click();
    cy.contains("Onnistui: Järjestö luotu onnistuneesti!");
    cy.reload()
    cy.contains("Teekkarit");

    });

    it("Modifying organization works for permitted users", function () {
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
      cy.get("[data-testid=create-organization-button]").click();
      cy.contains("Onnistui: Järjestö luotu onnistuneesti!");
      cy.reload();
      cy.contains("Teekkarit");
      cy.contains("teekkarit@mail.com");
      cy.get(".modify_org").click()
      cy.get("#organization_name").type("123");
      cy.get('.confirm_org_change').click();
      cy.reload();
      cy.contains("Teekkarit123");
      });  


    it("Deleting organization works for permitted users", function () {
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
      cy.get("[data-testid=create-organization-button]").click();
      cy.contains("Onnistui: Järjestö luotu onnistuneesti!");
      cy.reload();
      cy.get(".modify_org").click()
      cy.contains("Poista"). click()
      cy.reload();
      cy.contains("Teekkarit").should("not.exist");
   });
  })

  describe("Defectfaultpage", () => {
      beforeEach(function () {
        cy.request("POST", "http://localhost:8000/api/testing/reset");
        cy.visit("http://localhost:5173");
      });
      it("Creating fault works", function () {
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
    
        cy.contains("Viat").click();
        cy.contains("+ Lisää vika").click();
        cy.get("#description").type("Vessan ovenkahva irronnut");
        cy.get("#addfault").click();
        cy.reload();
        cy.contains("Vessan ovenkahva irronnut");

        cy.get("#repairfault").click();
        cy.get("#confirmremove").click();
        cy.contains("Vian korjaus onnistui");

        cy.get("#emailfault").click();
        cy.get("#confirmemail").click();
        cy.contains("Merkitseminen lähetetyksi onnistui");
      });
    });

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


describe("Cleaningshifts", () => {
    beforeEach(function () {
       cy.request("POST", "http://localhost:8000/api/testing/reset");
       cy.visit("http://localhost:5173/");
       cy.viewport(2560, 1440);
     });


    it("Cleaninglist can be created", function () {
      cy.on("uncaught:exception", () => {
          return false;
        });
        const body1 = {
          username: "super_prof",
          password: "salasana123",
          email: "super@gmail.com",
          telegram: "",
          role: 1,
        };
        let user_id1;
        cy.request("POST", "http://localhost:8000/api/users/register", body1).then(
          (response) => {
            user_id1 = response.body.id;
            expect(response.body).to.have.property("username", "super_prof");
          },
        );

        const body2 = {
          username: "varapj",
          password: "salasana123",
          email: "varapj@gmail.com",
          telegram: "",
          role: 1,
        };
        let user_id2;
        cy.request("POST", "http://localhost:8000/api/users/register", body2).then(
          (response) => {
            user_id2 = response.body.id;
            expect(response.body).to.have.property("username", "varapj");
          },
        );

        cy.wait(1000);
        cy.contains("Kirjaudu").click();
        cy.get("#email").type("super@gmail.com");
        cy.get("#password").type("salasana123");
        cy.get(".login-button").click();
    
        cy.wait(500);
        cy.contains("Hallinnointi").click();
    

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
          const req2 = {
            email: "sahkoposti@matrix.fi",
            homepage: "matrix.fi",
            name: "matrix",
            size: "1",
          };

        cy.request({
          method: "POST",
          url: "http://localhost:8000/api/organizations/create",
          body: req2,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          expect(response.body).to.have.property("name", "matrix");
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
              url: `http://localhost:8000/api/keys/hand_over_key/${user_id1}/`,
              body: request,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).then((response) => {
              expect(response.body).to.have.property("id", user_id1);
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
              url: `http://localhost:8000/api/keys/hand_over_key/${user_id2}/`,
              body: request,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).then((response) => {
              expect(response.body).to.have.property("id", user_id2);
            });
            });

            cy.window()
          .its("localStorage")
          .invoke("getItem", "ACCESS_TOKEN")
          .should("not.be.null")
          .then((token) => {
            const request2 = {
              organization_name: "matrix",
            };

            cy.request({
              method: "PUT",
              url: `http://localhost:8000/api/keys/hand_over_key/${user_id1}/`,
              body: request2,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).then((response) => {
              expect(response.body).to.have.property("id", user_id1);
            });
            });

        cy.contains("Siivousvuorot").click();
        cy.contains("Luo lista").click()
        cy.get("#threshold_value").type("2");
        cy.get(".create-cleaning-button").click()
        
        cy.contains("Tallenna").click()
        cy.get(".save-cleaninglist-button").click()
        cy.wait(1000);
        //checks that list is created and week no.6 can be found
        cy.contains('6').should('exist');

    })

    // it("Deleting cleaning list succeeds", function () {
    //   cy.on("uncaught:exception", () => {
    //       return false;
    //     });
    //     const body1 = {
    //       username: "super_prof",
    //       password: "salasana123",
    //       email: "super@gmail.com",
    //       telegram: "",
    //       role: 1,
    //     };
    //     let user_id1;
    //     cy.request("POST", "http://localhost:8000/api/users/register", body1).then(
    //       (response) => {
    //         user_id1 = response.body.id;
    //         expect(response.body).to.have.property("username", "super_prof");
    //       },
    //     );

    //     const body2 = {
    //       username: "varapj",
    //       password: "salasana123",
    //       email: "varapj@gmail.com",
    //       telegram: "",
    //       role: 1,
    //     };
    //     let user_id2;
    //     cy.request("POST", "http://localhost:8000/api/users/register", body2).then(
    //       (response) => {
    //         user_id2 = response.body.id;
    //         expect(response.body).to.have.property("username", "varapj");
    //       },
    //     );

    //     cy.wait(1000);
    //     cy.contains("Kirjaudu").click();
    //     cy.get("#email").type("super@gmail.com");
    //     cy.get("#password").type("salasana123");
    //     cy.get(".login-button").click();
    
    //     cy.wait(500);
    //     cy.contains("Hallinnointi").click();
    

    //     cy.window()
    //         .its("localStorage")
    //         .invoke("getItem", "ACCESS_TOKEN")
    //         .should("not.be.null")
    //         .then((token) => {
    //           const req = {
    //             email: "sahkoposti@tko-aly.fi",
    //             homepage: "tko-aly.fi",
    //             name: "tko-äly",
    //             size: "1",
    //           };

    //       cy.request({
    //         method: "POST",
    //         url: "http://localhost:8000/api/organizations/create",
    //         body: req,
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       }).then((response) => {
    //         expect(response.body).to.have.property("name", "tko-äly");
    //       });
    //     });

    //     cy.window()
    //     .its("localStorage")
    //     .invoke("getItem", "ACCESS_TOKEN")
    //     .should("not.be.null")
    //     .then((token) => {
    //       const req2 = {
    //         email: "sahkoposti@matrix.fi",
    //         homepage: "matrix.fi",
    //         name: "matrix",
    //         size: "1",
    //       };

    //     cy.request({
    //       method: "POST",
    //       url: "http://localhost:8000/api/organizations/create",
    //       body: req2,
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }).then((response) => {
    //       expect(response.body).to.have.property("name", "matrix");
    //     });
    //   });

    //     cy.window()
    //       .its("localStorage")
    //       .invoke("getItem", "ACCESS_TOKEN")
    //       .should("not.be.null")
    //       .then((token) => {
    //         const request = {
    //           organization_name: "tko-äly",
    //         };

    //         cy.request({
    //           method: "PUT",
    //           url: `http://localhost:8000/api/keys/hand_over_key/${user_id1}/`,
    //           body: request,
    //           headers: {
    //             Authorization: `Bearer ${token}`,
    //           },
    //         }).then((response) => {
    //           expect(response.body).to.have.property("id", user_id1);
    //         });
    //         });

    //       cy.window()
    //       .its("localStorage")
    //       .invoke("getItem", "ACCESS_TOKEN")
    //       .should("not.be.null")
    //       .then((token) => {
    //         const request = {
    //           organization_name: "tko-äly",
    //         };

    //         cy.request({
    //           method: "PUT",
    //           url: `http://localhost:8000/api/keys/hand_over_key/${user_id2}/`,
    //           body: request,
    //           headers: {
    //             Authorization: `Bearer ${token}`,
    //           },
    //         }).then((response) => {
    //           expect(response.body).to.have.property("id", user_id2);
    //         });
    //         });

    //         cy.window()
    //       .its("localStorage")
    //       .invoke("getItem", "ACCESS_TOKEN")
    //       .should("not.be.null")
    //       .then((token) => {
    //         const request2 = {
    //           organization_name: "matrix",
    //         };

    //         cy.request({
    //           method: "PUT",
    //           url: `http://localhost:8000/api/keys/hand_over_key/${user_id1}/`,
    //           body: request2,
    //           headers: {
    //             Authorization: `Bearer ${token}`,
    //           },
    //         }).then((response) => {
    //           expect(response.body).to.have.property("id", user_id1);
    //         });
    //         });

    //     cy.contains("Siivousvuorot").click();
    //     cy.contains("Luo lista").click()
    //     cy.get("#threshold_value").type("2");
    //     cy.get(".create-cleaning-button").click()
        
    //     cy.contains("Tallenna").click()
    //     cy.get(".save-cleaninglist-button").click()
    //     cy.wait(5500);
  
    //     cy.contains("Tyhjennä").click()
    //     cy.get(".delete-cleaninglist-button").click()
    //     cy.wait(2)    // might need wait or not
    //     cy.contains("Siivousvuorot poistettu onnistuneesti.");
    //   })


    it("Cleaninglist export to a json file succeeds", function () {
          cy.on("uncaught:exception", () => {
        return false;
      });
      const body1 = {
        username: "super_prof",
        password: "salasana123",
        email: "super@gmail.com",
        telegram: "",
        role: 1,
      };
      let user_id1;
      cy.request("POST", "http://localhost:8000/api/users/register", body1).then(
        (response) => {
          user_id1 = response.body.id;
          expect(response.body).to.have.property("username", "super_prof");
        },
      );

      const body2 = {
        username: "varapj",
        password: "salasana123",
        email: "varapj@gmail.com",
        telegram: "",
        role: 1,
      };
      let user_id2;
      cy.request("POST", "http://localhost:8000/api/users/register", body2).then(
        (response) => {
          user_id2 = response.body.id;
          expect(response.body).to.have.property("username", "varapj");
        },
      );

      cy.wait(1000);
      cy.contains("Kirjaudu").click();
      cy.get("#email").type("super@gmail.com");
      cy.get("#password").type("salasana123");
      cy.get(".login-button").click();
  
      cy.wait(500);
      cy.contains("Hallinnointi").click();
  

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
        const req2 = {
          email: "sahkoposti@matrix.fi",
          homepage: "matrix.fi",
          name: "matrix",
          size: "1",
        };

      cy.request({
        method: "POST",
        url: "http://localhost:8000/api/organizations/create",
        body: req2,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        expect(response.body).to.have.property("name", "matrix");
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
            url: `http://localhost:8000/api/keys/hand_over_key/${user_id1}/`,
            body: request,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((response) => {
            expect(response.body).to.have.property("id", user_id1);
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
            url: `http://localhost:8000/api/keys/hand_over_key/${user_id2}/`,
            body: request,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((response) => {
            expect(response.body).to.have.property("id", user_id2);
          });
          });

          cy.window()
        .its("localStorage")
        .invoke("getItem", "ACCESS_TOKEN")
        .should("not.be.null")
        .then((token) => {
          const request2 = {
            organization_name: "matrix",
          };

          cy.request({
            method: "PUT",
            url: `http://localhost:8000/api/keys/hand_over_key/${user_id1}/`,
            body: request2,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((response) => {
            expect(response.body).to.have.property("id", user_id1);
          });
          });
      
          cy.contains("Siivousvuorot").click();
          cy.contains("Luo lista").click()
          cy.get("#threshold_value").type("2");
          cy.get(".create-cleaning-button").click()
          
          cy.contains("Tallenna").click()
          cy.get(".save-cleaninglist-button").click()
          cy.wait(9000);
      
          cy.contains("Tuo lista").click()
          cy.wait(1000);

          const filePath = `cypress/downloads/siivousvuorot.json`;

          cy.readFile(filePath).should((json) => {
            // Check that the JSON array length is 53, i.e. shifts for every week of the year
            expect(json).to.have.length(53); 
          });
      
        })
    
        
    it("Creating cleaninglist by uploading a json file succeeds", function () {
          cy.on("uncaught:exception", () => {
        return false;
      });
      const body1 = {
        username: "super_prof",
        password: "salasana123",
        email: "super@gmail.com",
        telegram: "",
        role: 1,
      };
      let user_id1;
      cy.request("POST", "http://localhost:8000/api/users/register", body1).then(
        (response) => {
          user_id1 = response.body.id;
          expect(response.body).to.have.property("username", "super_prof");
        },
      );

      const body2 = {
        username: "varapj",
        password: "salasana123",
        email: "varapj@gmail.com",
        telegram: "",
        role: 1,
      };
      let user_id2;
      cy.request("POST", "http://localhost:8000/api/users/register", body2).then(
        (response) => {
          user_id2 = response.body.id;
          expect(response.body).to.have.property("username", "varapj");
        },
      );

      cy.wait(1000);
      cy.contains("Kirjaudu").click();
      cy.get("#email").type("super@gmail.com");
      cy.get("#password").type("salasana123");
      cy.get(".login-button").click();
  
      cy.wait(500);
      cy.contains("Hallinnointi").click();
  

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
        const req2 = {
          email: "sahkoposti@matrix.fi",
          homepage: "matrix.fi",
          name: "matrix",
          size: "1",
        };

      cy.request({
        method: "POST",
        url: "http://localhost:8000/api/organizations/create",
        body: req2,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        expect(response.body).to.have.property("name", "matrix");
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
            url: `http://localhost:8000/api/keys/hand_over_key/${user_id1}/`,
            body: request,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((response) => {
            expect(response.body).to.have.property("id", user_id1);
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
            url: `http://localhost:8000/api/keys/hand_over_key/${user_id2}/`,
            body: request,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((response) => {
            expect(response.body).to.have.property("id", user_id2);
          });
          });

          cy.window()
        .its("localStorage")
        .invoke("getItem", "ACCESS_TOKEN")
        .should("not.be.null")
        .then((token) => {
          const request2 = {
            organization_name: "matrix",
          };

          cy.request({
            method: "PUT",
            url: `http://localhost:8000/api/keys/hand_over_key/${user_id1}/`,
            body: request2,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((response) => {
            expect(response.body).to.have.property("id", user_id1);
          });
          });
      
          cy.contains("Siivousvuorot").click();
          cy.contains("Vie lista").click()

          const fileName = 'uploadtest_cleaninglist.json';

          cy.fixture(fileName).then((fileContent) => {
          cy.get('input[type="file"]').attachFile({
            fileContent,
            fileName,
            mimeType: 'application/json',
              });
            });;
          
          cy.wait(500);  
          cy.contains("Tallenna").click()
          cy.get(".save-cleaninglist-button").click()
          cy.wait(5000);
          cy.scrollTo('bottom');
          //checks that list is created and week no.53 can be found
          cy.contains('53').should('exist');
      
        })
  
    })


Cypress.on;
