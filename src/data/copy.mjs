export const hero = {
  headline: 'Your headache diary.',
  accent: 'Kept in order.',
  lede: 'A headache diary for iPhone and iPad. Log the pain each time it changes, what you took and what came with it — Inhead keeps it all on one line.',
  note: 'iPhone and iPad · No account · Nothing tracked',
};

// The live diary line at the top of the home page (src/lib/liveline.mjs draws it; the day's times are there).
// `names` are the app's own names for these entries; `label` describes the moving picture for screen readers.
export const live = {
  label:
    'A diary line drawing itself through one day: poor sleep, pain 3 out of 10 at nine, ibuprofen, coffee, pain 8 at noon, nausea, light sensitivity, pain 4, pain 2, the episode ended, menstruation.',
  pain: 'Pain',
  names: {
    sleep: 'Poor Sleep',
    med: 'Ibuprofen',
    coffee: 'Coffee',
    nausea: 'Nausea',
    light: 'Light Sensitivity',
    end: 'Episode Ended',
    period: 'Menstruation',
  },
};

// The feature, on the deep blue under the hills, beside the iPad's episode screen.
export const rise = {
  title: 'How it rose.',
  accent: 'And how it fell.',
  text: 'One headache keeps every pain level you log — each at its own time, with where it hurt and what it felt like — drawn as one curve with its peak.',
};

// One headache, hour by hour. The times and pain levels are in Home.astro; these are the words.
export const hours = {
  title: 'A headache is',
  accent: 'not one number.',
  steps: [
    { title: 'It starts.', text: 'When it began, how bad it is from 0 to 10, where it hurts and what it feels like.' },
    { title: 'Worse. Log the change.', text: 'The new level joins the same headache, at its own time — not a second entry.' },
    { title: 'Over. 8 hours, peak 8.', text: 'It shows on your month and your year, and in the PDF report you can take to your doctor.' },
  ],
};
export const privacy = {
  title: 'Your diary',
  accent: 'is yours.',
  lead: 'There is no Inhead server and no Inhead account — nothing of yours for us to read.',
  tiles: [
    { key: 'account', title: 'No account', text: 'No sign-up, no email, no password.' },
    { key: 'device', title: 'On your device', text: 'And in your own private iCloud only if you turn sync on. What Apple Health shares stays here.' },
    { key: 'tracking', title: 'Nothing tracked', text: 'No analytics, no advertising, no tracking across other apps or websites.' },
  ],
};

// The questions people ask about a headache diary, answered in the words the app uses. Shown on the home page,
// and given to search engines as FAQPage markup (src/lib/jsonld.mjs) — the visible text and the markup are the same.
export const faq = {
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
      'Your year on one page, and a PDF for your doctor with every figure next to its definition',
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
  iphone: 'Inhead on iPhone: the month view, with headache days drawn as soft colour blobs and the day’s episodes listed below',
  share: 'Inhead’s Data screen: a For your doctor card above a Your year grid of small squares, darker red for higher pain',
  ipad: 'Inhead on iPad: an episode’s detail, with its pain curve, the changes in pain through the day, and the pattern you named for it',
  record: 'Inhead’s Timeline screen: a week strip, an Ongoing section with Menstruation and Poor Sleep, and pain entries of 3/10, 8/10 and 4/10 at 09:00, 12:00 and 15:00',
  see: 'Inhead’s Episodes screen: a strip of days with headache days drawn as colour blobs, and below it an episode card with its pain curve',
};

export const footer = {
  blurb: 'A headache diary for iPhone and iPad.',
};

export const disclaimer =
  'Inhead is a headache diary. It describes what was recorded, not a diagnosis, and is not medical advice — talk to a doctor about your symptoms and treatment.';
