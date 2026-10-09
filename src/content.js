// Structure of the app. All visible text is referenced by key from
// src/i18n/strings.json (synced from the translation sheet).

export const img = (file) => `${import.meta.env.BASE_URL}img/${file}`

export const WEATHER = [
  { id: 'clear', img: img('weather-clear.jpg'), label: 'weather.clear' },
  { id: 'sunset', img: img('weather-sunset.jpg'), label: 'weather.sunset' },
  { id: 'breaking', img: img('weather-breaking.jpg'), label: 'weather.breaking' },
  { id: 'storm', img: img('weather-storm.jpg'), label: 'weather.storm' },
]

export const EMOTIONS = [
  { id: 'glad', img: img('emotion-glad.jpg') },
  { id: 'hopeful', img: img('emotion-hopeful.jpg') },
  { id: 'proud', img: img('emotion-proud.jpg') },
  { id: 'relieved', img: img('emotion-relieved.jpg') },
  { id: 'sad', img: img('emotion-sad.jpg') },
  { id: 'scared', img: img('emotion-scared.jpg') },
  { id: 'angry', img: img('emotion-angry.jpg') },
  { id: 'lonely', img: img('emotion-lonely.jpg') },
]

export const ACTORS = [
  { id: 'centreStaff', img: img('actor-centre-staff.jpg') },
  { id: 'representative', img: img('actor-representative.jpg') },
  { id: 'doctor', img: img('actor-doctor.jpg') },
  { id: 'psychologist', img: img('actor-psychologist.jpg') },
  { id: 'schoolStaff', img: img('actor-school-staff.jpg') },
  { id: 'friends', img: img('actor-friends.jpg') },
  { id: 'family', img: img('actor-family.jpg') },
  { id: 'resident', img: img('actor-resident.jpg') },
]

export const RIGHTS_CARDS = {
  representative: { text: 'card.representative', img: img('actor-representative.jpg') },
  health: { text: 'card.health', img: img('actor-doctor.jpg') },
}

// Step types: info, self (true for you?), myth (did you know?), chain,
// storyIntro, story, emotions, helpers, summary, card.
export const CHAPTERS = [
  {
    id: 'ch1',
    title: 'ch1.title',
    subtitle: 'ch1.subtitle',
    img: img('actor-representative.jpg'),
    steps: [
      { type: 'info', title: 'ch1.intro.title', text: 'ch1.intro.text', img: img('icon-handshake.png') },
      { type: 'self', id: 'ch1.met', img: img('icon-phone.png') },
      { type: 'self', id: 'ch1.interview', img: img('icon-map.png') },
      { type: 'self', id: 'ch1.interpreter', img: img('icon-interpreter.png') },
      { type: 'myth', id: 'ch1.complain', correct: 'false' },
      {
        type: 'summary',
        title: 'ch1.summary.title',
        items: ['ch1.summary.1', 'ch1.summary.2', 'ch1.summary.3', 'ch1.summary.4', 'ch1.summary.5', 'ch1.summary.6'],
        note: 'ch1.summary.note',
      },
      { type: 'card', card: 'representative' },
    ],
  },
  {
    id: 'ch2',
    title: 'ch2.title',
    subtitle: 'ch2.subtitle',
    img: img('actor-doctor.jpg'),
    steps: [
      { type: 'info', title: 'ch2.intro.title', text: 'ch2.intro.text', img: img('icon-health.png') },
      { type: 'myth', id: 'ch2.doctor', correct: 'false' },
      { type: 'chain' },
      { type: 'storyIntro', text: 'ch2.story.intro', skipTo: 'summary' },
      {
        type: 'story',
        title: 'story.quiet.title',
        panels: [1, 2, 3, 4].map((n) => ({ img: img(`story-quiet-${n}.jpg`), text: `story.quiet.${n}` })),
      },
      { type: 'emotions', id: 'ch2.emotions' },
      { type: 'helpers', id: 'ch2.helpers' },
      {
        type: 'summary',
        title: 'ch2.summary.title',
        items: ['ch2.summary.1', 'ch2.summary.2', 'ch2.summary.3', 'ch2.summary.4'],
        staff: 'ch2.staff',
      },
      { type: 'card', card: 'health' },
    ],
  },
  { id: 'ch3', title: 'ch3.title', subtitle: 'ch3.subtitle', img: img('sunny-tree.png'), comingSoon: true },
]
