export const hero = {
  headline: 'Your headache diary.',
  accent: 'Kept in order.',
  lede: 'Record what happened — when it started, how bad it was, what you took — and see what your own records add up to.',
  note: 'iPhone and iPad · No account · Nothing tracked',
};

export const rows = [
  {
    key: 'record',
    eyebrow: '1 · Record',
    title: 'Record what happened, as it happened.',
    lead: 'When it started and ended, how the pain changed while it lasted, and where it hurt.',
    points: [
      'Symptoms alongside it — nausea, sensitivity to light and sound, aura and more',
      'Medication you took, and when',
      'Factors you choose to follow: sleep, menstruation, weather, anything you want to keep an eye on',
    ],
  },
  {
    key: 'see',
    eyebrow: '2 · See',
    title: 'See what it adds up to.',
    lead: 'Your days at a glance: headache days, medication days, and the days you recorded nothing.',
    points: [
      'Which ICHD-3 criteria your own records meet, with the criteria written out so you can see why',
      'Acute medication days per month, counted by ICHD-3’s definition',
      'How your records change over time, drawn from what you entered and nothing else',
    ],
  },
  {
    key: 'share',
    eyebrow: '3 · Share',
    title: 'Take it to your doctor.',
    lead: 'Export a report you can hand over, carrying the numbers and the definitions behind them.',
    points: ['Every figure comes with its definition', 'The report goes only where you choose to send it'],
  },
];

export const privacy = {
  eyebrow: 'Private by design',
  title: 'Your diary is yours.',
  lead: 'There is no Inhead server and no Inhead account — nothing of yours for us to read.',
  tiles: [
    { key: 'account', title: 'No account', text: 'No sign-up, no email, no password.' },
    { key: 'device', title: 'On your device', text: 'And in your own private iCloud if you have iCloud switched on.' },
    { key: 'tracking', title: 'Nothing tracked', text: 'No analytics, no advertising, no tracking across other apps or websites.' },
  ],
};

export const cta = {
  title: 'Start your headache diary.',
  text: 'Inhead is coming to the App Store.',
};

export const homeBeta = {
  badge: 'Beta',
  text: 'Try Inhead on TestFlight before launch',
  link: 'Or join the beta',
};

export const beta = {
  eyebrow: 'Beta',
  headline: 'Help us build',
  accent: 'Inhead.',
  lede: 'Try Inhead on your iPhone or iPad before it reaches the App Store, and help shape it with what you notice.',
  cta: 'Join the beta on TestFlight',
  note: 'iPhone and iPad · Through Apple\'s TestFlight',
  rows: [
    {
      key: 'what',
      eyebrow: '1 · What it is',
      title: 'A beta is a head start.',
      lead: 'You use a version that is nearly finished, before it is public. It works, but it is not polished yet.',
      points: [
        'Delivered through Apple\'s TestFlight app',
        'Runs alongside your other apps like any other',
        'Ends when Inhead is released on the App Store',
      ],
    },
    {
      key: 'get',
      eyebrow: '2 · What you get',
      title: 'Early access, and a voice.',
      lead: 'Everything that is in the build today, and every new build as it lands.',
      points: [
        'Inhead on iPhone and iPad, ahead of the App Store',
        'New builds as they are made, through TestFlight',
        'A say in what gets fixed and what comes next',
      ],
    },
    {
      key: 'ask',
      eyebrow: '3 · What we ask',
      title: 'Use it. Tell us what you find.',
      lead: 'A few weeks of ordinary use tells us more than any checklist.',
      points: [
        'Keep your diary in it for a few weeks',
        'Tell us what is confusing, missing, or broken',
        'Expect rough edges — and keep your own copy of anything important',
      ],
    },
  ],
  join: {
    eyebrow: 'How to join',
    title: 'Install TestFlight, then open the invite.',
    steps: [
      { title: 'Install TestFlight', text: 'TestFlight is Apple\'s own app for trying apps before release. Get it from the App Store.' },
      { title: 'Open the invite link', text: 'Tap "Join the beta" on this page from your iPhone or iPad. TestFlight opens.' },
      { title: 'Install Inhead', text: 'Tap Accept, then Install. Updates arrive through TestFlight as builds are released.' },
    ],
  },
  feedback: {
    title: 'How to send feedback',
    intro: 'In TestFlight, take a screenshot in Inhead and choose',
    action: 'Share Beta Feedback',
    or: ', or write to',
  },
  closing: { title: 'Join the beta.', text: 'Two minutes to set up.' },
};

export const footer = {
  blurb: 'A headache diary for iPhone and iPad.',
};

// The hero's 3D models (public/models, built by scripts/make-models.mjs) are CC BY 4.0 and need crediting.
export const modelCredits = [
  { what: 'iPhone 17 Pro', by: 'Ranguel', url: 'https://sketchfab.com/3d-models/iphone-17-pro-4541aa8a28324b33a2baaf81d263aaec' },
  { what: 'iPad Pro 13″', by: 'polyman', url: 'https://sketchfab.com/3d-models/ipad-pro13in-black-m4-32e1748e3b6840108ededf4359112b2f' },
];

export const disclaimer =
  'Inhead is a headache diary. It describes what was recorded, not a diagnosis, and is not medical advice — talk to a doctor about your symptoms and treatment.';
