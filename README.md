# KiqqiDev (kiqqidev)

## Getting started

0. Sistem mora imati instalirano
  - [`nodejs`](https://nodejs.org/en/download/)
  - [`yarn`](https://yarnpkg.com/getting-started/install)

1. Install the dependencies
```bash
cd /do/projekta
yarn
```

2. Build&Run

Opcija a: Statički build - prvi put i nakon promjena u src folderu
```bash
yarn build
yarn start
```

Opcija b: Watch - automatski rebuilda app, ali je startup duzi
```bash
yarn start:watch
```

## Servisne informacije

Pokrecu se 2 servera:
- [https://localhost:3000](https://localhost:3000): server za static fajlove (igre)
- [http://localhost:8080](https://localhost:8080): web server

Prvo je potrebno otvoriti static server (port 3000) i dopustiti security exception.
Static fajlovi moraju biti servirani preko https-a jer se .wasm inace ne ucitava!
https certifikati su generirani i ukljuceni u projekt (ali posto su self-signed, browser im 'ne vjeruje').

### Web

Sastoji se od 3 stranice:
- games list (lista se ucitava iz games.json)
- game page (copy-paste loadera iz prod web app-a)
- endgame page (prikazuje jeli igra pokusala slati score i koji je request payload)

Slanje scora je hardkodirano na domenu dummy.com, te stoga ne radi. Bitno je da igra pokusa poslati score,
te ako se u endgame screenu vidi da je request poslan mozemo smatrati da igra pravilno salje score.

### games.json

Struktura je jednaka kao u web appu koji razvijamo.
Ako se mijenja games.json nije potrebno rebuildati app.

Fajl se ucitava kroz [app.ts](src/boot/app.ts). Tu se moze i konfigurirati drugi endpoint do static servera
(za primjer je ostavljen u komentaru url do naseg servera). Ukoliko se mijenja taj fajl, app se mora rebuildati!

### static folder
Dodana je samo igra mathderby. Struktura je ista kao i na cdn serveru.
