# WebBrain X Memory Engine

PWA + Netlify Function + base estensione Chrome.

## Funzioni principali
- Assistente di conoscenza personale
- Memoria intelligente: “Perché lo salvo?” obbligatorio
- Cosa contiene / perché interessa / tag intelligenti
- Relazioni manuali tra siti e libri
- Percorsi di apprendimento
- Sezione libri letti, in lettura e suggeriti
- Clustering locale TF-IDF / similarità
- Dashboard personale stile KPI
- AI vera tramite OpenAI API con Netlify Function
- Base estensione Chrome per URL visitati e tempo pagina

## OpenAI API su Netlify
1. Pubblica la cartella su Netlify.
2. Vai su Site configuration → Environment variables.
3. Aggiungi:
   - OPENAI_API_KEY = la tua API key
   - OPENAI_MODEL = gpt-5.4-mini oppure altro modello compatibile
4. Redeploy.
5. Nell'app apri la sezione AI.

## Nota sicurezza
Non mettere mai la API key dentro index.html. La chiave deve stare lato server/Netlify Function.

## Estensione Chrome
Cartella: chrome-extension
1. Chrome → chrome://extensions
2. Attiva Modalità sviluppatore
3. Carica estensione non pacchettizzata
4. Seleziona la cartella chrome-extension
