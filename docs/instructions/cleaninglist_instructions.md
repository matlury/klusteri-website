# Siivousvuorolistan käyttö ja luonti

## Yleiskatsaus

![Näkymä siivousvuorolistan sivusta](https://github.com/matlury/klusteri-website/blob/main/docs/img/instructions/cleaninglist_instructions.png)

1. Siivousvuorolista löytyy sivupalkista valitsemalla 'Siivousvuorot'.
2. Siivousvuorot löytyvät sivulla olevasta taulukosta.
3. Taulukon yksi rivi vastaa yhtä viikkoa. Rivillä on ilmoitettu viikko, jota rivi vastaa, viikon maanantai sekä kyseisellä viikolla siivouksen suorittavat järjestöt. Jo menneet viikot saavat automaattisesti harmaan pohjavärin.
4. Sivulta löytyvän siivousvuorolistan voi ladata omalle tietokoneelle json-tiedostona painamalla 'Vie lista'.
5. Omalta tietokoneelta json-tiedostosta löytyvän siivousvuorolistan voi ladata nettisivulle painamalla 'Tuo lista'. Json-tiedoston on oltava samassa muodossa kuin sivulta ladattava siivousvuorolista ja json-tiedostoon kirjoitettujen järjestöjen nimien on oltava kirjoitettu samalla tavalla kuin nettisivulla. Huomio myös, että painike 'Tuo lista' tuo vuorolistan vain selaimen välimuistiin. Käyttäjän on tallennettava lista tietokantaan erikseen.
6. Siivousvuorolistan voi myös luoda automaattisesti. Automaattinen luonti luo listan dynaamisesti järjestön avainten lukumäärän mukaan.
7. Tuotu tai luotu lista on tallennettava erikseen tietokantaan painamalla 'Tallenna'.
8. Olemassa olevan siivousvuorolistan voi tyhjentää painamalla 'Tyhjennä'.

## Siivousvuorolistan luonti automaattisesti

1. Varmista, että käyttäjä on kirjautuneena käyttäjällä jolla on tarvittavat oikeudet siivouslistan muokkaamiseen (LeppisPJ).
2. Varmista, että taulukko on tyhjä painamalla 'Tyhjennä' (merkitty kuvaan numerolla 8).
3. Varmista, että tietokantaan on luotu järjestöjä Hallinnointi-sivulla, ja että järjestöillä on avaimellisia.
4. Paina 'Luo lista' (merkitty kuvaan numerolla 6).

![Raja-arvon asettaminen](https://github.com/matlury/klusteri-website/blob/main/docs/img/instructions/cleaninglist_threshold.png)

6. Painike avaa dialogin. Täytä kenttään raja-arvo, jonka kokoiset ja suuremmat järjestöt lasketaan suuriksi järjestöiksi (iso järjestö >= raja-arvo | raja-arvo > pieni järjestö > 0)
7. Paina dialogiboksin 'Luo lista'-painiketta.
8. Paina 'Tallenna' (merkitty kuvaan numerolla 7). Siivousvuorolistan pitäisi nyt ilmestyä taulukkoon.

## Siivousvuorolistan manuaalisesti

1. Varmista, että käyttäjä on kirjautuneena käyttäjällä jolla on tarvittavat oikeudet siivouslistan muokkaamiseen (LeppisPJ).
2. Varmista, että taulukko on tyhjä painamalla 'Tyhjennä' (merkitty kuvaan numerolla 8).
3. Varmista, että tietokantaan on luotu järjestöjä Hallinnointi-sivulla, ja että järjestöillä on avaimellisia.
4. Paina 'Tuo lista' (merkitty kuvaan numerolla 5) ja valitse json-tiedosto, jonka perusteella lista luodaan. Tiedoston on oltava tietyssä muodossa, jotta sivusto osaa luoda sen perusteella listan. Muodon voi tarkistaa lataamalla sivustolta löytyvän listan. Huomioi, että json-tiedostoon merkittyjen järjestöjen on myös löydyttävä Hallinnointi-sivulta.
5. Paina 'Tallenna' (merkitty kuvaan numerolla 7). Siivousvuorolistan pitäisi nyt ilmestyä taulukkoon.
