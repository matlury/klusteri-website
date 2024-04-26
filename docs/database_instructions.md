# Ohjeet paikallisen tietokannan pystyttämiseen

1. Asenna PostgreSQL koneellesi, ellei se ole jo asennettuna.
2. Luo pgAdminin tai psql:n kautta koneellesi tietokanta
3. Luo ulompaan backend-kansioon .env tiedosto. Lisää tiedostoon seuraavat muuttujat: 

- TEST_DB_NAME = "testi_tietokannan_nimi"
- TEST_DB_USER = "testi_käyttäjä"
- TEST_DB_PASSWORD = "testi_salasana"
- TEST_DB_HOST = "localhost"
- TEST_DB_PORT = "5324"

Huomioithan, että muuttujien arvojen täytyy olla lainausmerkkien sisällä.
Huomioithan myös, että .env tiedoston täytyy olla .gitignoroituna.

## Ohjeet cypress-testaukseen löytyvät omasta omasta cypress.md tiedostosta :)