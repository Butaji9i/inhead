// Czech page text. Mirrors src/data/copy.mjs field for field (scripts/copy.test.mjs checks the shape).
// Terms follow the app's own Czech (headacher-ios Localizable.xcstrings and
// docs/czech-terminology-research.md): formal «vy», ICHD-3, no «diagnóza» even when negated.
// Where the site says what the App Store listing says, it uses the listing's approved wording (headacher-ios,
// docs/app-store-listing.md, "1.1.0 — What's New and the Czech and Russian listing").
export const hero = {
  headline: 'Váš deník bolestí hlavy.',
  accent: 'Přehledně uspořádaný.',
  lede: 'Zapište, co se stalo — kdy bolest začala, jak silná byla a co jste si vzali — a uvidíte, co vaše vlastní záznamy ukazují.',
  note: 'iPhone a iPad · Bez účtu · Nic se nesleduje',
};

export const rows = [
  {
    key: 'record',
    eyebrow: '1 · Zapisujte',
    title: 'Zapište to hned, jak se to stane.',
    lead: 'Kdy bolest začala a skončila, kde to bolelo a každá změna bolesti, dokud trvala.',
    points: [
      'Nová intenzita pokaždé, když se bolest zlepší nebo zhorší — jedna epizoda je všechny uchová jako křivku bolesti',
      'Příznaky, které ji provázely — nevolnost, citlivost na světlo a zvuk, aura a další',
      'Léky, které jste si vzali, a kdy',
      'Faktory, které chcete sledovat: spánek, menstruace, počasí — cokoli, na co chcete dát pozor',
    ],
  },
  {
    key: 'see',
    eyebrow: '2 · Prohlížejte',
    title: 'Podívejte se, co z toho vychází.',
    lead: 'Vaše dny na první pohled: dny s bolestí hlavy, dny s lékem a dny, kdy jste nic nezapsali.',
    points: [
      'Vaše záznamy porovnané s prahy ICHD-3, s citovanými kritérii, abyste viděli proč',
      'Dny s akutním lékem za měsíc, počítané podle definice ICHD-3',
      'Jak se vaše záznamy mění v čase, sestavené jen z toho, co jste zadali',
    ],
  },
  {
    key: 'share',
    eyebrow: '3 · Sdílejte',
    title: 'Vezměte to k lékaři.',
    lead: 'Exportujte zprávu, kterou můžete předat, s čísly i definicemi, ze kterých vycházejí.',
    points: ['Každé číslo má svou definici', 'Zpráva jde jen tam, kam ji sami pošlete'],
  },
];

export const privacy = {
  eyebrow: 'Soukromí od základu',
  title: 'Váš deník patří jen vám.',
  lead: 'Inhead nemá žádný vlastní server ani účty — nemáme u vás co číst.',
  tiles: [
    { key: 'account', title: 'Bez účtu', text: 'Žádná registrace, e-mail ani heslo.' },
    { key: 'device', title: 'Ve vašem zařízení', text: 'A ve vašem soukromém iCloudu, jen pokud zapnete synchronizaci.' },
    { key: 'tracking', title: 'Nic se nesleduje', text: 'Žádná analytika, žádná reklama, žádné sledování napříč jinými aplikacemi a weby.' },
  ],
};

export const faq = {
  eyebrow: 'Otázky',
  title: 'Na co se lidé ptají.',
  items: [
    {
      q: 'Dá se během jedné bolesti hlavy zaznamenat víc úrovní bolesti?',
      a: 'Ano. Když bolest hlavy začne, založte epizodu a pak klepněte na Zaznamenat změnu pokaždé, když se bolest zlepší nebo zhorší. Každá změna má svůj čas, intenzitu od 0 do 10, místo bolesti a její charakter a epizoda je vykreslí jako jednu křivku bolesti s vrcholem. Změnu, kterou jste v tu chvíli nezapsali, můžete doplnit později.',
    },
    {
      q: 'Je i pro migrénu, nejen pro jiné bolesti hlavy?',
      a: 'Je to deník pro jakoukoli bolest hlavy, migrénu nevyjímaje. Spolu s bolestí můžete zapsat auru, nevolnost, citlivost na světlo a zvuk, léky, které jste si vzali, a faktory, které sledujete, a vidět své záznamy porovnané s prahy ICHD-3. Popisuje, co jste zaznamenali; neříká, jaký druh bolesti hlavy máte.',
    },
    {
      q: 'Dá se deník bolestí hlavy ukázat lékaři?',
      a: 'Ano. Zprávu Pro lékaře exportujete jako PDF a u každého čísla je jeho definice. Jde jen tam, kam ji pošlete.',
    },
    {
      q: 'Potřebuji účet? Kde je deník uložený?',
      a: 'Žádný účet. Deník zůstává ve vašem iPhonu nebo iPadu a ve vašem soukromém iCloudu, jen pokud zapnete synchronizaci. Inhead nemá žádný server ani analytiku.',
    },
    {
      q: 'Na jakých zařízeních a v jakých jazycích funguje?',
      a: 'Na iPhonu a iPadu s iOS nebo iPadOS 26 a novějším, v angličtině, češtině a ruštině.',
    },
  ],
};

export const painPage = {
  title: 'Každá změna bolesti hlavy v jedné epizodě — Inhead',
  description:
    'V Inheadu, deníku bolestí hlavy a migrény pro iPhone a iPad, uchová jedna epizoda každou zaznamenanou intenzitu bolesti — s časem, místem a charakterem — a vykreslí je jako křivku bolesti.',
  homeLink: 'Jak zaznamenat změny bolesti',
  eyebrow: 'Bolest v čase',
  headline: 'Jedna bolest hlavy.',
  accent: 'Každá změna bolesti.',
  lede: 'Bolest hlavy je málokdy jedno číslo. V Inheadu jedna epizoda uchová každou intenzitu, kterou zaznamenáte — 3/10 na začátku, 8/10 v nejhorší chvíli, 4/10, když polevuje — každou v jejím čase.',
  how: {
    title: 'Jak to funguje',
    steps: [
      { title: 'Založte epizodu', text: 'Přidejte epizodu bolesti, když bolest hlavy začne, nebo později s časem, kdy začala. Prvním záznamem je bolest na začátku, od 0 do 10.' },
      { title: 'Zaznamenejte každou změnu', text: 'Když se bolest zlepší nebo zhorší, klepněte na Zaznamenat změnu. Každá změna má svůj čas, intenzitu, místo bolesti na mapě hlavy a její charakter. Na nějakou jste zapomněli? Doplňte ji později, k času, kdy nastala.' },
      { title: 'Ukončete ji, až přejde', text: 'Klepněte na Ukončit epizodu. Epizoda si uchová, jak dlouho trvala, svůj vrchol a kolikrát se bolest změnila, a celý průběh vykreslí jako křivku bolesti.' },
    ],
  },
  see: {
    title: 'Co uvidíte potom',
    points: [
      'Každá epizoda s křivkou bolesti, vrcholem a délkou trvání',
      'Váš měsíc s vyznačenými dny s bolestí hlavy a pod každým dnem jeho epizody',
      'Váš rok na jedné stránce — čím silnější bolest, tím tmavší červená',
      'Zpráva pro lékaře exportovaná jako PDF, u každého čísla s jeho definicí',
    ],
  },
  faqTitle: 'Otázky k záznamům bolesti',
  faq: [
    {
      q: 'Je nutné zapisovat změny hned, jak nastanou?',
      a: 'Ne. Zapište je hned, nebo je doplňte později s časem, kdy nastaly.',
    },
    {
      q: 'Co dalšího patří do stejné epizody?',
      a: 'Příznaky jako aura, nevolnost a citlivost na světlo a zvuk, léky, které jste si vzali, a kdy, a jestli vám bolest hlavy bránila v běžných činnostech.',
    },
  ],
  cta: { title: 'Veďte si deník bolestí hlavy v Inheadu.', text: 'V App Storu, pro iPhone a iPad.' },
};

export const cta = {
  title: 'Začněte si vést deník bolestí hlavy.',
  text: 'Inhead je v App Storu, pro iPhone a iPad.',
};

export const shots = {
  group: 'Obrazovky aplikace Inhead',
  ipad: 'Inhead na iPadu: podrobnosti epizody — křivka bolesti, záznamy bolesti během dne a druh, který jste jí dali',
  iphone: 'Inhead na iPhonu: měsíc, kde jsou dny s bolestí hlavy vyznačené jemnými barevnými skvrnami a pod ním epizody vybraného dne',
  record: 'Obrazovka Časová osa v Inheadu: pruh týdne, oddíl Probíhá s menstruací a špatným spánkem a záznamy bolesti 3/10, 8/10 a 4/10 v 9:00, 12:00 a 15:00',
  see: 'Obrazovka Epizody v Inheadu: pruh dní, kde jsou dny s bolestí hlavy vyznačené barevnými skvrnami, a pod ním karta epizody s křivkou bolesti',
  share: 'Obrazovka Data v Inheadu: karta Pro lékaře nad mřížkou Váš rok z malých čtverečků — čím silnější bolest, tím tmavší červená',
};

export const footer = {
  blurb: 'Deník bolestí hlavy pro iPhone a iPad.',
};

// The app's own disclaimer, verbatim (AppDisclaimer.swift, Czech).
export const disclaimer =
  'Inhead je deník bolestí hlavy, který popisuje, co bylo zaznamenáno, a nehodnotí zdravotní stav. Nenahrazuje lékařskou radu — o svých příznacích a léčbě se poraďte s lékařem.';
