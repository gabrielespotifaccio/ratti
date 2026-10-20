# A Little Rat’s World

**Per provarlo subito:** apri `Apri-il-mondo.html` con doppio clic in un browser moderno. È un’edizione autonoma con codice e illustrazioni incorporati; non richiede installazioni o server. Le preferenze salvate aprendo un file locale dipendono dal browser. `npm run build` rigenera anche questo file, oltre alla cartella `dist/` per GitHub Pages.

Una piccola stanza illustrata, un ratto curioso e un ritmo tranquillo. Un’esperienza interattiva per browser pensata come regalo: puoi osservare Remy mentre esplora, riposa, si pulisce e cerca qualcosa da sgranocchiare, oppure lasciargli uno spuntino, chiamarlo e accarezzarlo.

Il progetto è interamente statico, scritto in TypeScript con Vite. Non richiede account dei visitatori, server applicativi, database, chiavi API o servizi a pagamento. È predisposto per un repository GitHub pubblico e per GitHub Pages. La presenza del workflow **non significa che il repository o il sito siano già stati pubblicati**.

## Avvio locale

Installa Node.js 22 aggiornato e npm. Dalla cartella del progetto:

```sh
npm ci
npm run dev
```

Apri l’indirizzo locale mostrato da Vite. Per controllare e compilare la versione di produzione:

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

La build pronta per l’hosting si trova in `dist/`. Il progetto usa i moduli del browser: avvialo tramite il server locale, invece di aprire `index.html` direttamente con un doppio clic.

## Cosa puoi fare

- Osservare il comportamento autonomo: sonno, risveglio, stiracchiamento, cammino, brevi corse, annusate, pulizia, cibo, acqua, gioco e pause.
- Usare **Lascia uno spuntino**, poi toccare il pavimento. Remy raggiunge la destinazione e mangia. Con la tastiera, premi il pulsante e poi Invio sul riquadro della scena per posarlo in un punto accessibile.
- Toccare il ratto per accarezzarlo, oppure usare il pulsante dedicato. Il comando di richiamo lo invita ad avvicinarsi; se dorme, può continuare a riposare.
- Cambiare meteo, lampada, tende e lucine; lasciare un piccolo gioco.
- Scegliere lingua, nome, dettaglio delle animazioni, movimento ridotto, ora simulata, ora locale o illuminazione manuale.
- Attivare audio e musica dalle preferenze, regolando separatamente piccoli suoni e ambiente. L’audio parte solo dopo un gesto dell’utente.

I pensieri compaiono con pause naturali: 104 testi originali per lingua, suddivisi in 13 categorie. Dodici piccoli eventi, con condizioni e tempi di attesa, aggiungono variazioni alle visite. Non ci sono penalità per l’assenza del visitatore.

Su schermi stretti, l’inquadratura segue il ratto anziché ridurre tutta la stanza a una miniatura. I comandi HTML sono raggiungibili con la tastiera. Esc chiude i pannelli e annulla il posizionamento dello spuntino.

## Pubblicazione su GitHub Pages

La configurazione Vite usa `base: './'`: le risorse compilate funzionano sia alla radice di un dominio sia sotto il percorso di un repository dal nome personalizzato. Il nome del repository non è codificato nel gioco.

1. Crea su GitHub un repository pubblico vuoto, per esempio `a-little-rats-world`, senza inizializzare README o licenza sul sito.
2. Dalla cartella di questo progetto, esegui i comandi seguenti. Sostituisci `YOUR-USER` e, se desideri, il nome del repository:

```sh
git init -b main
git add .
git commit -m "Create A Little Rat's World"
git remote add origin https://github.com/YOUR-USER/a-little-rats-world.git
git push -u origin main
```

Se la cartella è già un repository Git, salta `git init`. Se esiste già un remote `origin`, controllalo con `git remote -v` prima di aggiungerlo.

In alternativa, con GitHub CLI installata e autenticata, dopo il primo commit:

```sh
gh repo create a-little-rats-world --public --source=. --remote=origin --push
```

3. Apri il repository su GitHub e scegli **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Nella scheda **Actions**, attendi il workflow **Publish to GitHub Pages**. Se il primo push è avvenuto prima di abilitare Pages, usa **Run workflow** per rilanciarlo.
5. Apri l’URL restituito dal job di deployment. Per un repository di progetto sarà normalmente `https://YOUR-USER.github.io/a-little-rats-world/`. Verifica il gioco a quell’indirizzo prima di condividere il link.

Il workflow `.github/workflows/deploy.yml` installa le dipendenze con `npm ci`, esegue i test, controlla TypeScript, compila e pubblica `dist/`. Ogni successivo push su `main` aggiorna il sito. GitHub può richiedere di autorizzare Actions o abilitare Pages secondo le impostazioni dell’account. Non inserire token o credenziali nel codice.

## Struttura e personalizzazione

| File | Contenuto |
| --- | --- |
| `src/main.ts` | Interazioni, integrazione della scena, eventi, impostazioni, inquadratura e ciclo principale |
| `src/art.ts` | Illustrazione originale della stanza e animazione procedurale del ratto su Canvas 2D |
| `src/world.ts` | Stati, bisogni, decisioni autonome, luoghi, collisioni, percorsi ed eventi |
| `src/audio.ts` | Suoni e ambiente sintetizzati con Web Audio |
| `src/persistence.ts` | Valori predefiniti, caricamento e salvataggio locale |
| `src/locales/en.ts`, `src/locales/it.ts` | Interfaccia e pensieri nelle due lingue |
| `src/style.css` | Interfaccia, pannelli, adattamento mobile e accessibilità |
| `tests/world.test.ts` | Navigazione, stati, bisogni, eventi e integrità delle traduzioni |

### Il tuo ratto

Il nome predefinito è **Remy** e può essere cambiato nel pannello delle preferenze senza modificare il codice. Per cambiare l’aspetto, intervieni nella funzione `drawRat` in `src/art.ts`: colori del mantello, orecchie, naso, proporzioni e dettagli vengono disegnati direttamente. I valori iniziali dei bisogni e i pesi delle decisioni sono nella classe `Rat` in `src/world.ts`.

### Pensieri e traduzioni

Ogni file di lingua esporta `{ ui, thoughts }`. Mantieni le stesse chiavi dell’interfaccia e le stesse categorie in entrambe le lingue. Le frasi corrispondenti occupano la stessa posizione negli array; `{name}` viene sostituito con il nome scelto dal visitatore. Aggiungi i nuovi testi in entrambe le lingue e lancia `npm test`.

### Nuove animazioni e oggetti

Aggiungi un nuovo stato al tipo `State` in `src/world.ts`, disegnane la posa in `drawRat`, poi collegalo a una decisione o interazione. Per un oggetto, disegnalo nella stanza, definisci un punto accessibile in `places` e collega un’azione. Se occupa il pavimento, aggiorna `walkable`, la proiezione `accessible` e la navigazione in modo coerente: l’aspetto grafico e le collisioni devono descrivere lo stesso ingombro. Aggiungi test di percorso per i nuovi ostacoli.

Gli eventi sono descritti nell’array `events`. Le condizioni di meteo e notte limitano quelli pertinenti; l’integrazione applica un intervallo generale e un tempo di attesa per ciascun evento. Per aggiungerne uno, scegli un ID stabile, luogo, stato e categoria di pensiero, poi aggiorna il conteggio delle scoperte nell’interfaccia.

## Dati locali e audio

Nome, preferenze, ultimo accesso, spuntini, interazioni e scoperte vengono conservati in `localStorage` nel browser. Non vengono inviati a un server e non si sincronizzano fra dispositivi o browser. La modalità privata o il blocco dello spazio locale possono limitare la persistenza. Cancellare i dati del sito rimuove questi ricordi.

Gli effetti audio sono generati dal codice tramite Web Audio; la musica è un semplice ambiente armonico. Il browser può sospendere l’audio o richiedere una nuova interazione per riattivarlo. La scena riduce il lavoro quando la scheda non è visibile e offre una qualità più leggera per dispositivi meno potenti.

## Risorse e licenza

Codice, illustrazioni Canvas, icone SVG e audio procedurale sono originali e inclusi nel progetto. Non vengono caricati personaggi, immagini, font o registrazioni audio di terze parti. Il progetto è distribuito con licenza MIT, riportata in `LICENSE`. Le dipendenze di sviluppo conservano le rispettive licenze; per aggiungere risorse esterne in futuro, verifica e documenta la loro licenza e le eventuali attribuzioni.

## Limiti della realizzazione

- La direzione visiva è interpretata con illustrazioni e animazioni procedurali Canvas 2D. Non ci sono dipinti bitmap, sprite disegnati fotogramma per fotogramma o un sistema scheletrico professionale. Un artista potrebbe aggiungere mantelli e animazioni più dettagliati mantenendo la logica esistente.
- La navigazione copre il pavimento accessibile e aggira gli ostacoli previsti. Remy non scala letto, mobili o davanzale; l’azione vicino alla finestra avviene sul pavimento.
- I dodici eventi sono piccole variazioni di azioni e luoghi, non dodici sequenze cinematografiche completamente distinte. Il custode è rappresentato da un’apparizione parziale stilizzata.
- L’ambiente musicale è sintetico e semplice, senza una colonna sonora registrata. Anche i piccoli suoni sono stilizzati.
- Meteo e ciclo del giorno sono simulati. L’opzione ora locale legge l’orologio del dispositivo; non sono usate API meteorologiche.
- Il mondo è locale al browser: nessun account, stato condiviso, salvataggio cloud o recupero dei dati dopo la cancellazione del browser.

Una build riuscita dimostra che il progetto compila; non sostituisce il controllo visivo nel browser e la verifica del sito dopo il deployment.
