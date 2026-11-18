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
    lead: 'When it started and ended, where it hurt, and every change in the pain while it lasted.',
    points: [
      'A new pain level each time it gets better or worse — one headache keeps them all, drawn as a pain curve',
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
      'Your records counted against the ICHD-3 thresholds, with the criteria cited so you can see why',
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
    { key: 'device', title: 'On your device', text: 'And in your own private iCloud only if you turn sync on.' },
    { key: 'tracking', title: 'Nothing tracked', text: 'No analytics, no advertising, no tracking across other apps or websites.' },
  ],
};

// The questions people ask about a headache diary, answered in the words the app uses. Shown on the home page,
// and given to search engines as FAQPage markup (src/lib/jsonld.mjs) — the visible text and the markup are the same.
export const faq = {
  eyebrow: 'Questions',
  title: 'What people ask.',
  items: [
    {
      q: 'Can I log more than one pain level during the same headache?',
      a: 'Yes. Start an episode when the headache starts, then tap Log Change whenever the pain gets better or worse. Each change keeps its own time, its intensity from 0 to 10, where it hurt and what it felt like, and the episode draws them as one pain curve with its peak. A change you missed at the time can be added afterwards.',
    },
    {
      q: 'Is it for migraine as well as other headaches?',
      a: 'It is a diary for any headache, migraine included. Alongside the pain you can record aura, nausea, sensitivity to light and sound, the medication you took and the factors you follow, and see your records counted against the ICHD-3 thresholds. It describes what you recorded; it does not tell you what kind of headache you have.',
    },
    {
      q: 'Can I show my headache diary to my doctor?',
      a: 'Yes. The For your doctor report exports as a PDF, with every figure next to its definition. It goes only where you send it.',
    },
    {
      q: 'Do I need an account? Where is my diary kept?',
      a: 'No account. Your diary stays on your iPhone or iPad, and in your own private iCloud only if you turn sync on. Inhead has no server and no analytics.',
    },
    {
      q: 'Which devices and languages does it work on?',
      a: 'iPhone and iPad with iOS or iPadOS 26 or later, in English, Czech and Russian.',
    },
  ],
};

// The page about logging pain as it changes (/pain-over-time/, src/components/PainOverTime.astro): the one thing
// people search for that the home page can only mention in passing.
export const painPage = {
  title: 'Log every change in a headache’s pain, in one episode — Inhead',
  description:
    'In Inhead, a headache and migraine diary for iPhone and iPad, one episode keeps every pain level you log, each at its own time, and draws them as a pain curve.',
  homeLink: 'How logging changes in pain works',
  eyebrow: 'Pain over time',
  headline: 'One headache.',
  accent: 'Every change in the pain.',
  lede: 'A headache is rarely one number. In Inhead, one episode keeps every pain level you log — 3/10 as it starts, 8/10 at its worst, 4/10 as it eases — each at its own time.',
  how: {
    title: 'How it works',
    steps: [
      { title: 'Start the episode', text: 'Add a pain episode when the headache starts, or later, with the time it began. Its first entry is the pain at the start, from 0 to 10.' },
      { title: 'Log every change', text: 'Tap Log Change when the pain gets better or worse. Each change has its own time, its intensity, where it hurt on a map of the head, and what it felt like. Missed one? Add it afterwards, at the time it happened.' },
      { title: 'End it when it’s over', text: 'Tap End Episode. The episode keeps how long it lasted, its peak and how many times the pain changed, and draws the whole course as a pain curve.' },
    ],
  },
  see: {
    title: 'What you see afterwards',
    points: [
      'Each episode with its pain curve, its peak and how long it lasted',
      'Your month, with headache days marked and each day’s episodes below it',
      'Your year on one page, darker red for higher pain',
      'A report for your doctor, exported as a PDF, with every figure next to its definition',
    ],
  },
  faqTitle: 'Questions about logging pain',
  faq: [
    {
      q: 'Do I have to log the changes as they happen?',
      a: 'No. Log them as they happen, or fill them in afterwards with the times they happened.',
    },
    {
      q: 'What else goes in the same episode?',
      a: 'Symptoms such as aura, nausea and sensitivity to light and sound, the medication you took and when, and whether the headache stopped you doing things.',
    },
  ],
  cta: { title: 'Keep your headache diary in Inhead.', text: 'On the App Store, for iPhone and iPad.' },
};

export const cta = {
  title: 'Start your headache diary.',
  text: 'Inhead is on the App Store, for iPhone and iPad.',
};

// The beta pill and link, for when the Beta page is back (see "Beta page" in README.md).
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
  note: 'iPhone and iPad · Through Apple’s TestFlight',
  rows: [
    {
      key: 'what',
      eyebrow: '1 · What it is',
      title: 'A beta is a head start.',
      lead: 'You use a version that is nearly finished, before it is public. It works, but it is not polished yet.',
      points: [
        'Delivered through Apple’s TestFlight app',
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
      { title: 'Install TestFlight', text: 'TestFlight is Apple’s own app for trying apps before release. Get it from the App Store.' },
      { title: 'Open the invite link', text: 'Tap “Join the beta on TestFlight” on this page from your iPhone or iPad. TestFlight opens.' },
      { title: 'Install Inhead', text: 'Tap Accept, then Install. Updates arrive through TestFlight as builds are released.' },
    ],
  },
  feedback: {
    title: 'How to send feedback',
    intro: 'While using the beta, take a screenshot and choose',
    action: 'Share Beta Feedback',
    or: ', or write to',
  },
  closing: { title: 'Join the beta.', text: 'Two minutes to set up.' },
};

// Alt text for the screenshots, which show the app in the page's language.
export const shots = {
  group: 'Screens from the Inhead app',
  ipad: 'Inhead on iPad: an episode’s detail, with its pain curve, the changes in pain through the day, and the pattern you named for it',
  iphone: 'Inhead on iPhone: the month view, with headache days drawn as soft colour blobs and the day’s episodes listed below',
  record: 'Inhead’s Timeline screen: a week strip, an Ongoing section with Menstruation and Poor Sleep, and pain entries of 3/10, 8/10 and 4/10 at 09:00, 12:00 and 15:00',
  see: 'Inhead’s Episodes screen: a strip of days with headache days drawn as colour blobs, and below it an episode card with its pain curve',
  share: 'Inhead’s Data screen: a For your doctor card above a Your year grid of small squares, darker red for higher pain',
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
