
![matlu](https://github.com/matlury/klusteri-website/assets/56686737/b9311516-5702-4d1b-a4c9-7d7b8b71f159)

# Klusterin nettisivut

[![Workflow Badge](https://github.com/matlury/klusteri-website/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/matlury/klusteri-website/actions/workflows/main.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/matlury/klusteri-website/branch/main/graph/badge.svg?token=OO3HO2Y8BR)](https://codecov.io/gh/matlury/klusteri-website)


## Dokumentaatiot

- [Product Backlog](https://github.com/orgs/matlury/projects/1)
- [Sprint 0 Task Board](https://github.com/orgs/matlury/projects/18)
- [Sprint 1 Task Board](https://github.com/orgs/matlury/projects/20)
- [Sprint 2 Task Board](https://github.com/orgs/matlury/projects/22)
- [Sprint 3 Task Board](https://github.com/orgs/matlury/projects/26)
- [Sprint 4 Task Board](https://github.com/orgs/matlury/projects/29)
- [Sprint 5 Task Board](https://github.com/orgs/matlury/projects/31)
  

## Definition of Done

- Taski toteutettu kuten pitää.
- Pylint score mahdollisimman korkea (8.00).
- Dokumentaatio suomeksi.
- Koodi englanniksi.
- Testikattavuus 70%.
- Toimii tuotantoympäristössä.

## Komentorivitoiminnot

### Backend

#### Käynnistäminen
Mene backend-hakemistoon
```bash
~klusteri-website/$ cd backend 
```
Asenna riippuvuudet ja käynnistä virtuaaliympäristö
```bash
poetry install
poetry shell
```
### Tietokannan rakentaminen
Katso ohjeet tietokannan pystyttämiseksi [täältä](https://github.com/matlury/klusteri-website/blob/main/docs/database_instructions.md)

Jos koodissa määriteltyjä tietokantatauluja on muokattu, on luotava uusi migraatio tietokantaa varten
```bash
python manage.py makemigrations
```
Omalta laitteelta löytyvän PostgreSQL-tietokannan saa alustettua valmiiden migraatioiden mukaan seuraavalla komennolla
```bash
python manage.py migrate
```

Käynnistä backend
```bash
python manage.py runserver
```

#### Testien suorittaminen

Mene backend-hakemistoon
```bash
~klusteri-website/$ cd backend 
```
Aja seuraava komento
```bash
python manage.py test tests
```

Testit voi ajaa myös pytestin avulla
```bash
poetry run coverage run --branch -m pytest
```
Tällöin testikattavuusraportin saa tulostettua konsoliin komennolla
```
coverage report
```
Pylint testin suorittaminen onnistuu komennolla
```
pylint backend
```

### Frontend

#### Käynnistäminen
Mene **frontend**-hakemistoon juuresta.
Asenna riippuvuudet komennolla:

```
npm install
```
Käynnistä **frontend** komennolla:
```
npm run dev
```

#### Testaaminen

Mene **frontend**-hakemistoon.
Aja testit komennolla:
```
npm test
```
Aja **Eslint** komennolla:
```
npx eslint src
```

Cypress-testeille löytyy ohjeet [täältä.](https://github.com/matlury/klusteri-website/blob/main/docs/cypress.md)

## Codecov ja coverage

Testikattavauusraportit lähetetään automaattisesti Codecoviin CI:n yhteydessä

Raportit muodostetaan seuraavilla komennoilla

Raportin muodostaminen backendille
```bash
~klusteri-website/backend/$ poetry run coverage xml
```

Raportin muodostaminen frontendille
```bash
~klusteri-website/frontend/$ npx jest --coverage
```

Huom! Codecov ei toistaiseksi ota huomioon cypress-testejä

