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
    lead: 'Kdy bolest začala a skončila, jak se během ní měnila a kde to bolelo.',
    points: [
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
