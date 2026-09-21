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
    lead: 'A month at a glance: headache days, medication days, and the days you recorded nothing.',
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
    points: ['Every figure comes with its definition', 'Nothing leaves your device unless you send it'],
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

export const footer = {
  blurb: 'A headache diary for iPhone and iPad.',
};

export const disclaimer =
  'Inhead is a headache diary. It describes what was recorded, not a diagnosis, and is not medical advice — talk to a doctor about your symptoms and treatment.';
