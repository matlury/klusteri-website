# Roolipohjaisen Pääsynhallinnan (RBAC) Dokumentaatio

Tämä dokumentti kuvaa kaikki käyttäjäroolit ja niiden oikeudet Klusterin nettisivustolla.

## Roolien Määritelmät

| Rooli ID | Roolin Nimi | Kuvaus |
|----------|-------------|---------|
| 1 | LEPPISPJ | Leppiksen puheenjohtaja - Täydet ylläpito-oikeudet |
| 2 | LEPPISVARAPJ | Leppiksen varapuheenjohtaja - Lähes täydet oikeudet |
| 3 | MUOKKAUS | Muokkausoikeudet - Voi muokata suurinta osaa sisällöstä |
| 4 | AVAIMELLINEN | Avaimellinen - Klusterin avaimenhaltija |
| 5 | TAVALLINEN | Tavallinen käyttäjä - Peruskäyttöoikeudet |
| 6 | JARJESTOPJ | Järjestön puheenjohtaja - Hallinnoi omaa järjestöä |
| 7 | JARJESTOVARAPJ | Järjestön varapuheenjohtaja - Avustaa järjestön pj:tä |

---

## Oikeudet Ominaisuuksittain

### 👤 Käyttäjähallinta

#### Käyttäjien Katselu
- **Täysi käyttäjälista (tiedoilla):** LEPPISPJ, LEPPISVARAPJ, MUOKKAUS, JARJESTOPJ
- **Suppea käyttäjälista (vain ID ja käyttäjänimi):** Kaikki kirjautuneet käyttäjät

#### Käyttäjäprofiilin Päivittäminen
- **Omat tiedot:** Kaikki kirjautuneet käyttäjät voivat päivittää oman profiilinsa (käyttäjänimi, sähköposti, telegram, salasana)
- **Muiden tiedot:** 
  - LEPPISPJ, LEPPISVARAPJ: Voivat päivittää kenen tahansa tiedot
  - MUOKKAUS: Voi päivittää **vain AVAIMELLINEN (4) ja TAVALLINEN (5) käyttäjiä** - ei voi muokata ylläpitorooleja (LEPPISPJ, LEPPISVARAPJ, MUOKKAUS) eikä järjestörooleja

#### Käyttäjäroolin Muuttaminen
- **LEPPISPJ, LEPPISVARAPJ:** Voivat muuttaa kenen tahansa roolin mihin tahansa rooliin
- **MUOKKAUS:** Voi muuttaa käyttäjien roolit **vain** AVAIMELLINEN (4) tai TAVALLINEN (5)
  - **Ei voi** myöntää hallintorooleja (LEPPISPJ, LEPPISVARAPJ, MUOKKAUS)
  - **Ei voi** myöntää järjestörooleja (JARJESTOPJ, JARJESTOVARAPJ)
- **Rajoitukset kaikille:** 
  - Ei voi muuttaa omaa rooliaan (estää itsensä nostamisen)
  - Turvallisuusvalidointi tapahtuu backendissä

#### Käyttäjän Poistaminen
- **Kuka voi poistaa:** Vain LEPPISPJ, LEPPISVARAPJ

#### LeppisPJ-Roolin Siirto
- **Kuka voi siirtää:** Vain nykyinen LEPPISPJ
- **Vaikutus:** Nykyisestä LEPPISPJ:stä tulee TAVALLINEN, valitusta käyttäjästä tulee LEPPISPJ

---

### 🏢 Järjestöhallinta

#### Järjestöjen Katselu
- **Kaikki kirjautuneet käyttäjät** voivat katsella järjestölistaa

#### Järjestön Luominen
- **Kuka voi luoda:** Vain LEPPISPJ

#### Järjestön Päivittäminen
- **Täydet oikeudet:** LEPPISPJ, LEPPISVARAPJ (voivat muokata mitä tahansa järjestöä)
- **Rajoitetut oikeudet:** MUOKKAUS, JARJESTOPJ, JARJESTOVARAPJ (voi muokata vain järjestöjä, joissa on jäsenenä)

#### Järjestön Poistaminen
- **Kuka voi poistaa:** Vain LEPPISPJ, LEPPISVARAPJ

---

### 🔑 Avainten Hallinta

#### Avainten Luovuttaminen
- **Kuka voi luovuttaa:** LEPPISPJ, LEPPISVARAPJ, MUOKKAUS
- **Tarkoitus:** Myöntää järjestöjen avaimet käyttäjille

---

### 📅 Tapahtuma-/Varausjärjestelmä

#### Tapahtumien Katselu
- **Kaikki kirjautuneet käyttäjät** voivat katsella tapahtumia

#### Tapahtuman Luominen
- **Roolin perusteella:** LEPPISPJ, LEPPISVARAPJ, MUOKKAUS, JARJESTOPJ, JARJESTOVARAPJ
- **Varausoikeuden perusteella:** Kaikki käyttäjät, joilla `rights_for_reservation = True`

#### Tapahtuman Päivittäminen
- **Täydet oikeudet:** LEPPISPJ, LEPPISVARAPJ, MUOKKAUS (voivat muokata mitä tahansa tapahtumaa)
- **Järjestöjohtajat:** JARJESTOPJ, JARJESTOVARAPJ
- **Avaimenhaltijat varausoikeuksilla:** AVAIMELLINEN-käyttäjät, joilla `rights_for_reservation = True`
- **Tapahtuman luoja:** Käyttäjä voi aina muokata itse luomaansa tapahtumaa, roolista riippumatta
- **Varausoikeudella:** Käyttäjät, joilla `rights_for_reservation = True`

#### Tapahtuman Poistaminen
- **Täydet oikeudet:** LEPPISPJ, LEPPISVARAPJ (voivat poistaa minkä tahansa tapahtuman)
- **Tapahtuman luoja:** Käyttäjä voi aina poistaa itse luomansa tapahtuman, roolista riippumatta

#### Varausoikeuksien Muuttaminen
- **Kuka voi myöntää/peruuttaa:** LEPPISPJ, LEPPISVARAPJ, JARJESTOPJ, JARJESTOVARAPJ

---

### 🌙 Yövastuuvuorojen Hallinta (YKV)

#### Yövastuuvuorojen Katselu
- **Kaikki kirjautuneet käyttäjät** voivat katsella

#### Yövastuuvuoron Luominen
- **Kuka voi luoda:** LEPPISPJ, LEPPISVARAPJ, MUOKKAUS, AVAIMELLINEN, JARJESTOPJ

#### Yövastuuvuoron Päivittäminen
- **Kuka voi päivittää:** LEPPISPJ, LEPPISVARAPJ, MUOKKAUS, AVAIMELLINEN, JARJESTOPJ
- **Rajoitus:** Voi päivittää vain omia vastuuvuoroja tai itse luomiaan

#### YKV:n Uloskirjaus
- **Kuka voi kirjata ulos:** LEPPISPJ, LEPPISVARAPJ, MUOKKAUS, AVAIMELLINEN, JARJESTOPJ
- **Rajoitus:** Voi kirjata ulos vain omia vastuuvuoroja tai itse luomiaan

#### YKV:n Pakotettu Uloskirjaus
- **Kuka voi pakottaa uloskirjauksen:** LEPPISPJ, LEPPISVARAPJ, MUOKKAUS (hallinnollisiin tarkoituksiin)

---

### 🛠️ Vikailmoitusten Hallinta

#### Vikailmoitusten Katselu
- **Kaikki kirjautuneet käyttäjät** voivat katsella vikailmoituksia

#### Vikailmoituksen Luominen
- **Kaikki kirjautuneet käyttäjät** voivat raportoida vikoja

#### Vikailmoituksen Päivittäminen
- **Kuka voi päivittää:** LEPPISPJ, LEPPISVARAPJ, MUOKKAUS

#### Vikailmoituksen Poistaminen
- **Kuka voi poistaa:** LEPPISPJ, LEPPISVARAPJ, MUOKKAUS, AVAIMELLINEN, JARJESTOPJ, JARJESTOVARAPJ

---

### 🧹 Siivouslistojen Hallinta

#### Siivouspäivien Katselu
- **Kaikki kirjautuneet käyttäjät** voivat katsella

#### Siivouslistan Luominen/Päivittäminen
- **Kuka voi hallita:** Vain LEPPISPJ

#### Siivouslistan Lataaminen
- **Kuka voi ladata:** Vain LEPPISPJ

---

### 🧰 Siivousvälineiden Hallinta

#### Siivousvälineiden Katselu
- **Kaikki kirjautuneet käyttäjät** voivat katsella

#### Siivousvälineen Luominen
- **Kuka voi luoda:** LEPPISPJ, LEPPISVARAPJ, MUOKKAUS, AVAIMELLINEN, JARJESTOPJ, JARJESTOVARAPJ

#### Siivousvälineen Poistaminen
- **Kuka voi poistaa:** LEPPISPJ, LEPPISVARAPJ, MUOKKAUS, AVAIMELLINEN, JARJESTOPJ, JARJESTOVARAPJ

---

### 🔐 Järjestelmän Ylläpito

#### Tietokannan Tyhjennys (Vain Testiympäristössä)
- **Kuka voi tyhjentää:** Vain LEPPISPJ, LEPPISVARAPJ
- **Vaatimukset:** 
  - Käyttäjän oltava kirjautunut
  - DEBUG-tilan oltava päällä
  - CYPRESS ympäristömuuttuja asetettava TAI GitHub Actions ajossa
  - **Ei koskaan saatavilla tuotannossa**

---

## Pikaoikeus-Matriisi

| Oikeus | LEPPISPJ | LEPPISVARAPJ | MUOKKAUS | AVAIMELLINEN | TAVALLINEN | JARJESTOPJ | JARJESTOVARAPJ |
|--------|----------|--------------|----------|--------------|------------|------------|----------------|
| **Käyttäjät** |
| Käyttäjien katselu | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Oman profiilin päivitys | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Muiden päivitys | ✅ | ✅ | 🟡 Rajoitettu | ❌ | ❌ | ❌ | ❌ |
| Roolien muutos | ✅ | ✅ | 🟡 Vain 4&5 | ❌ | ❌ | ❌ | ❌ |
| Käyttäjien poisto | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Järjestöt** |
| Järjestöjen katselu | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Järjestön luonti | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Järjestön päivitys | ✅ | ✅ | 🟡 Vain omat | ❌ | ❌ | ❌ | ❌ |
| Järjestön poisto | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Avainten luovutus | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Tapahtumat** |
| Tapahtumien katselu | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tapahtuman luonti | ✅ | ✅ | ✅ | 🟡 Oikeus* | 🟡 Oikeus* | ✅ | ✅ |
| Tapahtuman päivitys | ✅ | ✅ | ✅ | 🟡 Tai luoja | 🟡 Tai luoja | ✅ | ✅ |
| Tapahtuman poisto | ✅ | ✅ | 🟡 Tai luoja | 🟡 Tai luoja | 🟡 Tai luoja | 🟡 Tai luoja | 🟡 Tai luoja |
| Varausoikeuksien muutos | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **YKV (Yövastuuvuorot)** |
| YKV:n katselu | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| YKV:n luonti | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| YKV:n päivitys | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| YKV:n uloskirjaus | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Pakotettu uloskirjaus | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Vikailmoitukset** |
| Vikojen katselu | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Vian ilmoitus | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Vian päivitys | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Vian poisto | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Siivous** |
| Siivouslistan katselu | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Siivouslistan hallinta | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Siivousvälineet | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |

*Oikeus = Vaatii `rights_for_reservation` -lipun arvoksi `True`

**Selite:**
- ✅ Täydet oikeudet
- 🟡 Rajoitetut/ehdolliset oikeudet
- ❌ Ei oikeuksia

**Tärkeä huomio MUOKKAUS-roolista:**
- MUOKKAUS voi päivittää vain AVAIMELLINEN (4) ja TAVALLINEN (5) käyttäjiä
- MUOKKAUS voi muuttaa käyttäjien roolit **vain** AVAIMELLINEN (4) tai TAVALLINEN (5)
- MUOKKAUS **ei voi** muokata ylläpitorooleja (LEPPISPJ, LEPPISVARAPJ, MUOKKAUS)
- MUOKKAUS **ei voi** muokata tai myöntää järjestörooleja (JARJESTOPJ, JARJESTOVARAPJ)

**Tärkeä huomio tapahtumien muokkaamisesta:**
- **Kuka tahansa käyttäjä** voi muokata ja poistaa itse luomiaan tapahtumia, roolista riippumatta
- Vain ylläpitäjät (LEPPISPJ, LEPPISVARAPJ) voivat poistaa muiden luomia tapahtumia

---

## Turvallisuusnäkökulmat

### Roolien Määrittämisen Parhaat Käytännöt

1. **Vähimmän oikeuden periaate:** Myönnä käyttäjälle vain tehtäviinsä tarvittavat minimioi keudet
2. **Säännölliset tarkastukset:** Tarkista käyttäjäroolit säännöllisesti ja muuta tarvittaessa
3. **Roolien erottelu:** 
   - Vain yksi LEPPISPJ kerrallaan
   - Rajoita LEPPISVARAPJ-rooleja 1-2 käyttäjään
   - MUOKKAUS-rooli vain sisällönmuokkaajille

### Suojatut Toiminnot

Seuraavilla toiminnoilla on lisäturva toimenpiteitä:

1. **Roolimuutokset:**
   - Käyttäjät eivät voi muuttaa omaa rooliaan
   - Vain LEPPISPJ ja LEPPISVARAPJ voivat muuttaa rooleja
   - Kaikki roolimuutokset validoidaan palvelimella

2. **Salasanavaatimukset:**
   - Nykyinen salasana vaaditaan omien tietojen päivityksessä
   - Djangon salasanavalidointi käytössä
   - LEPPISPJ voi resetoida salasanoja ilman nykyistä salasanaa

3. **Tietokannan tyhjennys:**
   - Saatavilla vain testi-/kehitysympäristöissä
   - Vaatii kirjautumisen + admin-roolin + DEBUG-tilan
   - Ei koskaan saatavilla tuotannossa

### Oikeuksien Toteutus

Oikeudet valvotaan usealla tasolla:

1. **Backend (Ensisijainen):** 
   - DRF-oikeusluokat tiedostossa `backend/ilotalo/permissions.py`
   - Näkymätason roolintarkistukset tiedostossa `backend/ilotalo/views.py`
   - Serializer-tason validointi tiedostossa `backend/ilotalo/serializers.py`

2. **Frontend (Vain käyttöliittymä):**
   - Roolipohjainen komponenttien renderöinti
   - **Huom:** Frontend-tarkistukset ovat vain käytettävyyteen, eivät turvallisuuteen
   - Kaikki todellinen auktorisointi tapahtuu backendissä

---

## Koodiviittaukset

### Backend
- **Roolien määrittelyt:** `backend/ilotalo/config.py`
- **Oikeusluokat:** `backend/ilotalo/permissions.py`
- **Näkymätoteutukset:** `backend/ilotalo/views.py`
- **Serializers:** `backend/ilotalo/serializers.py`

### Frontend
- **Roolivakiot:** `frontend/src/roles.js`
- **Oikeustarkistukset:** `frontend/src/pages/ownpage.jsx`

---

## Muutosohjeita

Kun muutat roolien oikeuksia:

1. Päivitä näkymien oikeustarkistukset tiedostossa `views.py`
2. Päivitä DRF-oikeusluokat tiedostossa `permissions.py`
3. Päivitä frontendin ehdollinen renderöinti
4. Päivitä tämä dokumentaatio
5. Päivitä testit heijastamaan uusia oikeuksia
6. Kommunikoi muutokset kaikille ylläpitäjille

---

## Usein Kysytyt Kysymykset

### K: Voiko käyttäjällä olla useita rooleja?
**V:** Ei, jokaisella käyttäjällä on täsmälleen yksi rooli kerrallaan.

### K: Kuinka myönnän väliaikaisia korotettuja oikeuksia?
**V:** Käytä `rights_for_reservation`-lippua tapahtumien luontioikeuksiin, tai muuta käyttäjän roolia väliaikaisesti (ei suositella lyhytaikaiseen käyttöön).

### K: Mitä tapahtuu kun LEPPISPJ siirtää roolinsa?
**V:** Nykyisestä LEPPISPJ:stä tulee TAVALLINEN, ja valitusta käyttäjästä tulee uusi LEPPISPJ. Tämä on tahallista varmistaaksemme että vain yksi LEPPISPJ on olemassa.

### K: Voiko JARJESTOPJ hallita kaikkia järjestöjä?
**V:** Ei, järjestöjen puheenjohtajat voivat hallita vain oman järjestönsä tapahtumia ja jäseniä.

### K: Kuka voi nähdä käyttäjien henkilökohtaiset tiedot (sähköposti, telegram)?
**V:** Hallintaroolit (LEPPISPJ, LEPPISVARAPJ, MUOKKAUS, JARJESTOPJ) näkevät täydet käyttäjätiedot. Muut käyttäjät näkevät vain ID:t ja käyttäjänimet.

---

## Liittyvä Dokumentaatio

- [Tietoturvakatsauksen Raportti](../SECURITY_AUDIT.md)
- [API-dokumentaatio](../README.md)
- [Hallinnointi-ohjeet](instructions/hallinnointi_instructions.md)
- [Tietokantarakenne](instructions/database_instructions.md)

---

*Viimeksi päivitetty: 11. helmikuuta 2026*
