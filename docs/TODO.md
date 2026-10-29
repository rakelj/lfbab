# Gjøremål

Fra workshopen med LFB (oktober 2026) og tidligere økter. Vi tar én ting av
gangen. Kryss av og skriv versjonsnummer når noe er publisert.

## Fra workshopen

### 1. Aktiviteter (Hva liker du å gjøre?)
- [x] Valg for «ubestemt» aktivitet med spørsmålstegn (v0.2.4). De seks
      eksisterende aktivitetene beholdes inntil videre.
- [x] Eget steg før «Veien videre» for informasjonen om å snakke med en
      ansatt (v0.2.4).
- [x] «Veien videre»: én oppmuntrende setning per valgt aktivitet, i
      tillegg til «Husk:» (v0.2.4).
- [x] Forbehold om at ikke alle aktiviteter finnes alle steder (v0.2.4).
- [x] Steget før «Veien videre» og «Du har rett til» på slutten er
      fjernet etter tilbakemelding (v0.3.1). Påstanden om penger kommer
      rett etter introen.
- [ ] Ny aktivitet «Håndarbeid og kreativitet» (venter på
      illustrasjonslisten).

### 2. Fjern humørsjekken (været)
- [x] Fjernet ved start og ved avslutning, med tekster og innstillinger
      (v0.2.8). Introfilmen bruker fortsatt værbildene som bakgrunn.

### 3. Kropp og hode: «Hvem ville du snakket med først?»
- [x] Bedre introtekst, som sier at man kan trykke på kortet (v0.2.9).
- [x] Trykk på et aktørkort åpner teksten om personen, med «Velg denne»
      (v0.2.9).

### 4. Spillet «Hvem kan hjelpe?»
- [x] Spillet er en øvelse uten konkurransepreg, og kortsamlingen
      (rettighetskortene) er fjernet (v0.3.0).
- [x] Øvelsen slutter med «Vil du lære mer?» og knappen «Se alle kortene»
      (v0.3.0).

### 5. «Trenger du hjelp?»
- [ ] Jobb med utheving, farger og skrift.
- [ ] Gjør tydelig at å be om hjelp ikke påvirker asylsaken.

### 6. Trygghet
- [x] Plikter: «Kan jeg dra fra mottaket når jeg vil?» og «Dine plikter»
      (v0.2.5).
- [x] Situasjonene fra dokumentene: negativ sosial kontroll i familien,
      «Kroppen din er din», politiet 112 og anonym chat (v0.2.5).
- [ ] LFB skriver svaret på «Kan jeg dra fra mottaket når jeg vil?»
      (`x.safety.leave.text`, nå PLACEHOLDER).

### 7. Rettighetene dine på mottaket
- [x] Rett til medvirkning: infosteg og «Stemmer dette for deg?» (v0.2.6).
- [x] Rett til informasjon: fantes fra før («Jeg får informasjon på et
      språk jeg forstår»).
- [x] Personlig integritet: «Du skal bli behandlet med respekt» og «Har de
      ansatte lov til å holde meg fast?» (v0.2.6).
- [x] «Dine plikter på mottaket» etter rettighetene (v0.2.6).

### 8. Rettigheter (og plikter) på slutten av hver del
- [x] Hver del slutter med skjermen «Du har rett til», og pliktene der det
      passer (v0.2.7).
- [x] Samme illustrasjon på alle sluttskjermene, nå PLACEHOLDER
      (`public/img/rights-placeholder.svg`) (v0.2.7).
- [ ] Illustratøren lager den felles illustrasjonen. Bytt ut
      `rights-placeholder.svg` i `RightsStep` (src/steps/Steps.jsx).
- [ ] Bildene som bare ble brukt på rettighetskortene, kan slettes hvis de
      ikke brukes andre steder.

### 9. Hele appen: alle situasjonene fra tekstene
- [x] Alle situasjonene samlet i Google-dokumentet «Alle situasjoner fra
      tekstene» (LFB-mappen i Drive). Et oppslagsverk, ikke noe som må
      godkjennes. Valg: appen er for enslige 15–18 på mottak; det som bare
      gjelder omsorgssenter eller familie, venter.
- [ ] Bygg inn situasjonene merket Nei/Delvis, tema for tema (punkt 6, 7
      og 8 bruker listen). LFB sjekker tekstene i tekstarket som vanlig.

### 10. Rekkefølgen på temaene i oversikten
- [x] Ny rekkefølge (v0.2.8): Representanten, Mottaket, Penger og skole,
      Fritid, Kropp og hode, Trygghet, Barnevernet, Klage. Styres av
      `ORDER` i src/content.js. Bente kan fortsatt komme med endringer.

## Tilbakemelding 29. oktober
- [x] «Trenger du hjelp?»: Representanten din (v0.3.1).
- [x] Kropp og hode: teksten etter historiene handler om Hamlin/Elias
      (v0.3.1).
- [x] Trygghet: «Kan jeg kreve å bli kjørt med bil dit jeg vil?» (v0.3.1).
- [x] Barnevernet: «Hvis jeg kontakter barnevernet – hva skjer da?»
      (v0.3.1).
- [x] Introfilmens tekst ligger allerede i arket (`film.1`–`film.6`).
- [ ] Liste over alle eksisterende og planlagte illustrasjoner, med valg
      for hver: beholde eller endre.
- [ ] Aktørkortene som snus: Ina lager forsider uten skrift, appen legger
      på navnet som tekst (alle språk).
- [ ] Følelseskortene beholdes (steget «Hva tror du {navn} føler?»). Ina
      lager versjoner uten skrift, appen legger på ordet som tekst.

## Fra tidligere økter
- [ ] Oversikten over UDI, Bufdir og aktørene (lysark 8, «Hvem er vi i
      forhold til andre?»): bestem plassering før vi bygger.
- [ ] Egen GitHub-organisasjon for LFB, så appen ikke ligger på en privat
      konto.
- [ ] Arabisk i Elias-historien (`story.shut.3`) sier fortsatt «avhør»,
      men den norske teksten er endret til «asylintervjuet».

## Om noen uker: oversettelse
- [ ] Byrået oversetter (først til engelsk, så videre). Spør om de vil ha
      én Excel-fil eller én per språk.
- [ ] Skript som lager Excel-filen (bare godkjente norske tekster som
      mangler eller er utdatert) og leser den inn igjen med sjekker.
- [ ] Skjult fane som husker hvilken norsk tekst hver oversettelse er
      laget fra, og en oversiktsfane per språk.
- [ ] Avtal med byrået hva de gjør med LFBs historieoversettelser i 9
      språk.
