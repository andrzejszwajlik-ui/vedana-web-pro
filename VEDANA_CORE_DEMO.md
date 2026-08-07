# Vedana Core — demonstrator

Demonstrator działa wyłącznie w przeglądarce. Nie wymaga backendu Schedulera,
logowania, bazy danych, integracji Manus ani zewnętrznego AI. Dodani pacjenci są
zapisywani lokalnie przez przeglądarkę (`localStorage`).

## Uruchomienie lokalne

```bash
pnpm install
pnpm dev:core
```

Otwórz adres <http://localhost:5173/vedana-core>. Polecenie uruchamia osobną
konfigurację Vite i nie uruchamia serwera aplikacji ani Schedulera.

## Test i build

```bash
pnpm test:core
pnpm build:core
```

Gotowe pliki statyczne znajdą się w `dist/core`. Można je sprawdzić lokalnie,
uruchamiając w tym katalogu dowolny serwer plików statycznych.

## Publiczny podgląd

Najprostszy podgląd bez własnego serwera to statyczny hosting: wykonaj
`pnpm build:core`, a następnie przeciągnij cały katalog `dist/core` do panelu
Cloudflare Pages (Direct Upload) albo Netlify Drop. Katalog zawiera samodzielny
`index.html` i zasoby; nie trzeba konfigurować zmiennych środowiskowych ani
żadnej usługi backendowej.
