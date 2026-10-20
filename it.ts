const it: { ui: Record<string, string>; thoughts: Record<string, string[]> } = {
  ui: {
    title: "Il piccolo mondo di un ratto", subtitle: "Una piccola vita. Un mondo intero.", feed: "Lascia uno spuntino", pet: "Una carezza", call: "Chiama {name}", weather: "Meteo", settings: "Piccole preferenze", sound: "Audio", close: "Chiudi", name: "Il nome del tuo ratto", language: "Lingua", music: "Musica delicata", quality: "Dettaglio animazioni", time: "Ora del giorno", reduced: "Movimento ridotto", sfx: "Piccoli suoni", ambience: "Suoni della stanza", auto: "L’orologio di questo mondo", local: "La tua ora locale", day: "Luce del giorno", sunset: "Ora dorata", night: "Chiaro di luna", clear: "Sereno", rain: "Pioggia", cloudy: "Nuvole", snow: "Neve", high: "Ricco", low: "Leggero", skip: "Salta l’introduzione", intro: "Da qualche parte, in un angolo tranquillo del mondo, una piccolissima avventura si sta svegliando.", description: "Una camera accogliente illustrata dove un piccolo ratto domestico esplora, riposa, mangia e condivide qualche pensiero. Usa i comandi per dargli uno spuntino, accarezzarlo o chiamarlo.", hint: "Fermati un po’. Succedono piccole cose.", stats: "La nostra piccola storia", treats: "Spuntini condivisi", interactions: "Piccoli momenti", discoveries: "Scoperte", reset: "Inizia una nuova piccola storia", credits: "Un mondo illustrato originale, creato con il codice.", placing: "Scegli un punto sul pavimento per lo spuntino", waiting: "Qui non c’è fretta.", saved: "Salvato in questo browser", lights: "Lucine decorative", lamp: "Lampada sul comodino", curtains: "Tende", toy: "Lascia un piccolo gioco"
  },
  thoughts: {
    general: [
      "La stanza è enorme. Per fortuna, anche la mia curiosità.",
      "Ho quattro zampe e nemmeno un appuntamento.",
      "Forse la polvere è fatta di nuvole in pensione.",
      "Essere {name} è un lavoro a tempo pieno.",
      "Il pavimento non mi ha mai deluso. A parte le scale.",
      "Anche una giornata tranquilla può contenere una briciola importantissima.",
      "Chissà chi ha deciso che i soffitti dovessero stare così lontani.",
      "La mia coda mi segue di nuovo. Un’amica fedele."
    ],
    hungry: [
      "I miei baffi sospettano uno spuntino nei paraggi.",
      "Una ciotola vuota è una domanda con una risposta deliziosa.",
      "Mangerei una montagna. Una piccola montagna a misura di ratto.",
      "Oggi l’aria sembra quasi commestibile.",
      "Controllerò la situazione in cucina. Da questa stanza.",
      "Ci sarà pure una briciola sfuggita agli umani.",
      "La mia pancia ha presentato un piccolo suggerimento.",
      "È ora di pranzo? Accetto risposte approssimative."
    ],
    sleepy: [
      "Non sto sbadigliando. Sto collaudando la faccia.",
      "Questo angolo ha un ottimo potenziale da cuscino.",
      "Sognare è esplorare con le zampe spente.",
      "Chiuderò gli occhi per ascoltare meglio la stanza.",
      "La coperta mi capisce fino in fondo.",
      "Ancora cinque minuti. Forse sei piccolini.",
      "La mia coda dorme già. Dovrei raggiungerla.",
      "Un bel pisolino fa spazio alle scoperte di domani."
    ],
    curious: [
      "Qualcosa è diverso. Potrebbe essere tutto.",
      "Cosa c’è dietro? E dietro il dietro?",
      "Un odore misterioso merita un naso scrupoloso.",
      "Se mi allungo, forse le risposte sono lassù.",
      "Il mondo lascia indizi all’altezza dei baffi.",
      "Indagherò con tutte e due le orecchie.",
      "Quell’oggetto è sospettosamente interessante da stamattina.",
      "Chissà se gli umani sentono l’odore delle idee nuove."
    ],
    happy: [
      "Le quattro zampe concordano: è una bella giornata.",
      "In questo preciso momento non c’è niente da sistemare.",
      "Un tappeto morbido e un angolo sicuro. Una bella fortuna.",
      "Oggi mi sento le orecchie particolarmente rotonde.",
      "Se la serenità avesse una forma, sarebbe questa pagnottella.",
      "Ho tutto ciò che serve a portata di naso.",
      "C’è un piccolo raggio di sole nella mia pancia.",
      "La vita è bella quando la tua scatola preferita è ancora una scatola."
    ],
    window: [
      "Fuori è una stanza grandissima senza tetto.",
      "Un uccello! Che zampe anteriori stravaganti.",
      "La finestra tiene il vento nella sua stanza.",
      "Forse le nuvole stanno portando spuntini da qualche parte.",
      "Quell’albero saluta. Ricambierò muovendo un orecchio.",
      "Quanto mondo. Comincerò da questo davanzale.",
      "L’orizzonte mi sembra un po’ oltre la portata del mio salto.",
      "Osservare è un’avventura di tutto rispetto."
    ],
    rain: [
      "Il cielo si sta lavando i baffi.",
      "Ogni goccia ha un posto urgentissimo dove andare.",
      "La finestra crea piccoli fiumi per piccole barche.",
      "La pioggia mi piace soprattutto quando ho il pelo asciutto.",
      "Sembra che il mondo applauda sottovoce.",
      "Forse le pozzanghere sono le finestre di scorta del cielo.",
      "Una giornata di pioggia è perfetta per una casa di cartone.",
      "Quella goccia ha vinto la corsa. Facevo il tifo per lei."
    ],
    night: [
      "La luna è una briciola che qualcuno non ha finito.",
      "Di notte persino i mobili sussurrano.",
      "Le lucine sono lucciole molto educate.",
      "Il buio rende una piccola stanza meravigliosamente segreta.",
      "Sento la casa che si mette comoda.",
      "Le stelle sarebbero più facili da contare se avessi più dita.",
      "La lampada ha conservato un pezzetto di tramonto.",
      "Buonasera, ombre. Attenzione alla mia coda."
    ],
    petted: [
      "Ah. Hai trovato il punto perfetto.",
      "Farò finta di non essermi avvicinato apposta.",
      "Le mie orecchie sono diventate due morbide frittelline.",
      "Certe conversazioni non hanno bisogno di squittii.",
      "Sì, è il clima ideale per i grattini sulla testa.",
      "Mi sento come un calzino caldo pieno di felicità.",
      "Una mano gentile è un bel posto dove posare un pensiero.",
      "Verdetto ufficiale di {name}: continua pure."
    ],
    exploring: [
      "Questo angolo è cambiato dall’ultimo controllo. Emotivamente.",
      "Sotto il letto è un paese completamente diverso.",
      "Non lascio nessuna fessura interessante senza annusarla.",
      "Il tappeto è una foresta se tieni gli occhi bassi.",
      "Un esploratore coraggioso controlla sempre la via del ritorno.",
      "Ho scoperto il retro di qualcosa.",
      "Ogni viaggio comincia con un naso molto serio.",
      "Aggiornamento della mappa: qui è ancora qui. Promettente."
    ],
    eating: [
      "Un piccolo banchetto merita entrambe le zampe.",
      "Questa è la cosa più importante che succede nella mia bocca.",
      "Me la godrò una briciola alla volta.",
      "Le mie zampe sono ottime posate.",
      "Uno spuntino è più buono dopo una piccola spedizione.",
      "Volevo conservarne un po’. Un piano ambizioso.",
      "Lo scricchiolio fa parte della ricetta.",
      "Caro spuntino, grazie di essere qui."
    ],
    missing: [
      "La stanza è silenziosa. Ai passettini ci penso io.",
      "Chissà quali angoli interessanti stai scoprendo.",
      "Qui c’è sempre un posto caldo per una voce familiare.",
      "Posso tenermi parecchio occupato con questo pezzetto di carta.",
      "Forse anche tu stai facendo merenda. Un bel pensiero.",
      "Il mondo è pieno di cose da raccontarti più tardi.",
      "Oggi colleziono momenti tranquilli.",
      "Possiamo goderci la stessa luna da finestre diverse."
    ],
    welcome: [
      "Eccoti. Vieni a vedere il mio normalissimo, meraviglioso angolo.",
      "Bentornato. Il tappeto resta eccellente.",
      "Una presenza familiare. La mia sorpresa preferita.",
      "Sei arrivato giusto in tempo per niente di urgente.",
      "Ho fatto diverse scoperte. Soprattutto di cartone.",
      "Ciao di nuovo. Ascoltiamo la stanza insieme?",
      "Rapporto di {name}: tutti gli angoli sono al loro posto.",
      "Una piccola visita scalda tutta la stanza."
    ]
  }
};
export default it;
