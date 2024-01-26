# Klusterin nettisivut

![workflow badge](https://github.com/matlury/klusteri-website/workflows/CI/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/matlury/klusteri-website/branch/main/graph/badge.svg?token=OO3HO2Y8BR)](https://codecov.io/gh/matlury/klusteri-website)


## Dokumentaatiot

- [Product Backlog](https://github.com/orgs/matlury/projects/1)
- [Sprint 0 Task Board](https://github.com/orgs/matlury/projects/2/views/1)
- [Sprint 1 Task Board](https://github.com/orgs/matlury/projects/4)
- [Työaikakirjanpito](https://helsinkifi-my.sharepoint.com/:x:/g/personal/lottatan_ad_helsinki_fi/EZIQBLlssnFAqYrJUHNZ14gBl33k5Y19wSDGfExXcVhacw?e=qAxWNy)

## Definition of Done

- Task toteutettu kuten pitää.
- Pylint score mahdollisimman korkea (8.00).
- Dokumentaatio suomeksi.
- Koodi englanniksi.
- Testikattavuus 70%.
- Toimii tuotantoympäristössä.

## Asennus
Placeholder

## Komentorivitoiminnot

### Backend
Mene (ulompaan) backend-hakemistoon, asenna riippuvuudet ja käynnistä virtuaaliympäristö
```bash
poetry install
poetry shell
```

Jos backendin koodia on muutettu, täytyy ajaa seuraavat komennot ennen kuin backendin voi käynnistää
```bash
python manage.py makemigrations
python manage.py migrate
```

Käynnistä backend
```bash
python manage.py runserver
```

### Frontend
Mene **frontend** tiedoston sisälle juuresta.
Asenna riippuvuudet komennolla:

```
npm install
```
Käynnistä frontend komennolla:
```
npm run dev
```

