# Verifica della consegna

Verificato il 21 ottobre 2026.

- `npm test`: 9 test superati. Percorsi, collisioni lungo i segmenti, punti ai bordi degli ostacoli, luoghi raggiungibili, fame, arrivo al cibo, riposo, risveglio, traduzioni ed eventi.
- `npm run build`: controllo TypeScript strict e build Vite completati. Generata anche l’edizione autonoma `Apri-il-mondo.html`.
- Browser desktop: scena e ratto visibili, movimento autonomo, pensieri contestuali, coccole e richiamo. Spuntino posato da tastiera e ratto osservato nello stato di alimentazione dopo lo spostamento.
- Preferenze: nome modificato in Nocciola, lingua inglese e ora notturna; nome, lingua e ora presenti dopo il ricaricamento.
- Meteo: selezione della pioggia e relativo pensiero; verificati i controlli di illuminazione e le scene giorno, tramonto e notte.
- Smartphone: viewport 390 × 844, nessun contenuto orizzontale fuori pagina, comandi accessibili e inquadratura che segue il ratto.
- Build di produzione aperta via HTTP sotto `/a-little-rats-world/`: script e CSS caricati dal sottopercorso corretto. Nessun errore JavaScript critico nei log letti durante le prove.

La verifica è locale. Non sono stati creati un repository GitHub remoto o un sito pubblico, perché non era disponibile un collegamento GitHub autenticato. Il README contiene i comandi per pubblicare e il workflow Pages è incluso.

Il browser di verifica consente solo URL HTTP/HTTPS: l’apertura diretta `file://` dell’edizione autonoma non è stata verificata. Il file HTML contiene internamente JavaScript, CSS, icona e illustrazioni e non richiede risorse esterne.

Non è stato eseguito un benchmark su hardware mobile reale né un audit completo con screen reader. I limiti grafici e funzionali della realizzazione sono descritti nel README.
