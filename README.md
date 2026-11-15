# Stories – Framework7

En separat Framework7-version av sajten i `/Users/hakangleissman/stories`.
Originalets sidor och berättelsetext har bevarats. Berättelsen om Eris har lagts till. En orörd kopia ligger i
`original/`; den ursprungliga projektmappen har inte ändrats.

## Starta lokalt

Node.js 20.19+ eller 22+ och npm behövs.

```sh
npm ci
npm run dev
```

Öppna adressen som Vite skriver ut. `npm run dev -- --port 5173` väljer en bestämd port.

## Bygg och förhandsvisa

```sh
npm run build
npm run preview
```

`dist/` innehåller statiska filer. Node behövs vid utveckling och bygge, inte på webbservern.
PWA/service worker aktiveras i produktionsbygget, inte under vanlig utveckling.

## Navigation och utseende

- Framework7 Core (lite) sköter navigation, sidövergångar och tillbaka-svep.
- Startsida → Grekisk mytologi → Kung Midas och åsneöronen eller Bröllopsgästen som ingen ville bjuda.
- Header och sidfot ligger kvar; bara innehållet i mitten animeras.
- Headerns tillbaka-knapp uppdateras med aktuell föräldrasida och döljs på startsidan.
- Tillbaka-knappen och logotypen fungerar även efter omladdning av en direktlänk.
- Hashadresser (`#!/grekisk/`, `#!/midas/`, `#!/eris/`) fungerar på statisk hosting.
- Sidövergången är en horisontell `f7-push` på 550 ms med mjuk acceleration
  och inbromsning. Tillbaka-svepets avslutning är 550 ms.
  Ändra CSS-variablerna i `src/app.css` för att justera hastigheten.
- Bakgrunden är en varm beige färgtoning utan bild.
  Originalbilden i `original/media/` är oförändrad.
- Typsnitt, färger, hero-bilder och hela berättelsen är från originalet.
- iOS/Android-tema väljs automatiskt. Reducerad rörelse respekteras.
- `src/pages.js`: sidinnehåll och routes.
- `src/app.js`: appstart och navigationsinställningar.
- `src/original.css`: grundstilen från sajten, med bildbakgrunden ersatt.
- `src/app.css`: Framework7-anpassning, mobilmått, safe areas och animationstider.

## PWA på iPhone och Android

Publicera `dist/` via HTTPS. Öppna sajten i Safari på iPhone och välj
Dela → Lägg till på hemskärmen → Öppna som webbapp (om valet visas).
På Android används webbläsarens installationsval.

Appens egna filer, all text och ikoner cachas för offlinebruk efter första
lyckade besöket. Båda hero-bilderna är lokala och cachas för offlinebruk. Google Fonts hämtas
fortfarande från externa adresser och cachas när de har hämtats; utan dessa
används reservtypsnitt.

## GitHub Pages

1. Lägg detta projekt i ett eget GitHub-repository (projektmappens innehåll i repositoryts rot).
2. Välj **Settings → Pages → Source → GitHub Actions**.
3. Pusha till `main` eller kör workflowen manuellt.

`.github/workflows/pages.yml` bygger och publicerar `dist/`. Den hämtar rätt
basadress från GitHub Pages så även projektsökvägar som `/stories/` stöds.
För lokalt bygge till en bestämd basadress:

```sh
BASE_PATH=/stories/ npm run build
```

Inget har publicerats eller pushats automatiskt under konverteringen.

## App Store senare

Det här projektet är en webbapp/PWA. En App Store-version kräver separat
paketering med exempelvis Capacitor, plattformstestning och publicering.

Startsidan använder den lokala hero-bilden `public/media/bild.jpg` (1170 × 658 px).
Den cachas tillsammans med appens övriga filer för offlinebruk.

Grekisk mytologi använder den lokala AVIF-bilden `public/media/bild2.avif`.

## Installationserbjudande

På skärmar upp till 600 px visar sidfoten ”Lägg till på hemskärmen” tills användaren väljer Jag förstår,
Avbryt eller svarar på webbläsarens installationsfråga. Valet sparas i localStorage
per app-sökväg. Knappen döljs också i fristående app-läge.
På iPhone visas en Safari-instruktion; själva installationen kräver delningsmenyn.
Där `beforeinstallprompt` stöds används webbläsarens riktiga installationsruta.
I andra webbläsare visas instruktioner. Koden ligger i `src/install.js`.

Kinesisk mytologi finns på `#!/kinesisk/` och länkar till Apkungen och Buddha
på `#!/sun-wukong/`. Berättelsens fullständiga text finns i `src/pages.js`.

Zenberättelser finns på `#!/zen/` och länkar till den bearbetade berättelsen
De två munkarna på `#!/de-tva-munkarna/`.

Den kinesiska samlingen (`#!/kinesisk/`) har två underkategorier:
Kinesisk mytologi (`#!/kinesisk-mytologi/`) med Apkungen och Buddha,
och Kinesiska berättelser (`#!/kinesiska-berattelser/`) med Jägaren som glömde sig själv (`#!/jagaren/`).

Kinesiska berättelser (`#!/kinesisk/`) listar nu Apkungen och Buddha samt
Jägaren som glömde sig själv direkt. Tidigare underkategoriadresser leder hit.

Kinesiska berättelser använder `public/media/bild4.jpg` (900 × 600 px),
med beskärning anpassad för desktop och mobil.
