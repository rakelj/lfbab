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
  activities: { text: 'card.activities', img: img('activity-sport.jpg') },
}

export const ACTIVITIES = [
  { id: 'sport', img: img('activity-sport.jpg') },
  { id: 'skate', img: img('activity-skate.jpg') },
  { id: 'food', img: img('activity-food.jpg') },
  { id: 'games', img: img('activity-games.jpg') },
  { id: 'learn', img: img('activity-learn.jpg') },
  { id: 'social', img: img('friends.png'), cutout: true },
]

// Stories from LFB's workshop. `name` fills {name} in the questions after the story.
export const STORIES = {
  quiet: {
    title: 'story.quiet.title',
    name: 'Hamlin',
    cover: img('story-quiet-2.jpg'),
    panels: [1, 2, 3, 4].map((n) => ({ img: img(`story-quiet-${n}.jpg`), text: `story.quiet.${n}` })),
  },
  shut: {
    title: 'story.shut.title',
    name: 'Elias',
    cover: img('story-shut-2.jpg'),
    panels: [1, 2, 3].map((n) => ({ img: img(`story-shut-${n}.jpg`), text: `story.shut.${n}` })),
  },
}

// Step types: info, self (true for you?), myth (did you know?), chain,
// storyChoice, story, emotions, helpers, summary, activities, activitySummary, card.
// Steps with an `id` keep their answer while the chapter is open; later steps
// can read earlier answers (e.g. which story was chosen).
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
      { type: 'storyChoice', id: 'ch2.story', text: 'ch2.story.choose', skipTo: 'summary' },
      { type: 'story', storyFrom: 'ch2.story' },
      { type: 'emotions', id: 'ch2.emotions', storyFrom: 'ch2.story' },
      { type: 'helpers', id: 'ch2.helpers', storyFrom: 'ch2.story' },
      {
        type: 'summary',
        title: 'ch2.summary.title',
        items: ['ch2.summary.1', 'ch2.summary.2', 'ch2.summary.3', 'ch2.summary.4'],
        staff: 'ch2.staff',
      },
      { type: 'card', card: 'health' },
    ],
  },
  {
    id: 'ch3',
    title: 'ch3.title',
    subtitle: 'ch3.subtitle',
    img: img('activity-sport.jpg'),
    steps: [
      { type: 'info', title: 'ch3.intro.title', text: 'ch3.intro.text', img: img('sunny-tree.png') },
      { type: 'activities', id: 'ch3.activities' },
      { type: 'myth', id: 'ch3.cost', correct: 'false' },
      {
        type: 'activitySummary',
        activitiesFrom: 'ch3.activities',
        title: 'ch3.summary.title',
        items: ['ch3.summary.1', 'ch3.summary.2', 'ch3.summary.3', 'ch3.summary.4'],
      },
      { type: 'card', card: 'activities' },
    ],
  },
]
