import { EXTRA_CHAPTERS } from './content/extra.js'

// Structure of the app. All visible text is referenced by key from
// src/i18n/strings.json (synced from the translation sheet).

export const img = (file) => `${import.meta.env.BASE_URL}img/${file}`

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

export const ACTIVITIES = [
  { id: 'sport', img: img('activity-sport.jpg') },
  { id: 'skate', img: img('activity-skate.jpg') },
  { id: 'food', img: img('activity-food.jpg') },
  { id: 'games', img: img('activity-games.jpg') },
  { id: 'learn', img: img('activity-learn.jpg') },
  { id: 'social', img: img('friends.png'), cutout: true },
  // Not decided yet: a question mark instead of a picture.
  { id: 'other', question: true },
]

// Stories from LFB's workshop, in LFB's own words (so their translations line
// up page by page). Each page has text and one of the story's pictures; some
// pictures are used for two pages. `name` fills {name} in the questions after.
const storyPages = (id, pictures) =>
  pictures.map((pic, i) => ({ img: img(`story-${id}-${pic}.jpg`), text: `story.${id}.${i + 1}` }))

export const STORIES = {
  quiet: {
    title: 'story.quiet.title',
    sub: 'story.quiet.sub',
    name: 'story.quiet.name',
    cover: img('story-quiet-2.jpg'),
    panels: storyPages('quiet', [1, 2, 2, 3, 3, 4]),
  },
  shut: {
    title: 'story.shut.title',
    sub: 'story.shut.sub',
    name: 'story.shut.name',
    cover: img('story-shut-2.jpg'),
    panels: storyPages('shut', [1, 1, 2, 2, 3]),
  },
}

// "Who can help?" game: situations with 3–4 cards to choose from. `best`
// get highlighted with the reason from their card back; other picks are
// shown as "also good to talk to", never as wrong.
export const SITUATIONS = [
  { id: 'sleep', options: ['psychologist', 'doctor', 'centreStaff', 'schoolStaff'], best: ['psychologist', 'doctor'] },
  { id: 'letter', options: ['representative', 'centreStaff', 'doctor', 'friends'], best: ['representative', 'centreStaff'] },
  { id: 'lonely', options: ['friends', 'resident', 'doctor', 'representative'], best: ['friends', 'resident'] },
  { id: 'stomach', options: ['doctor', 'schoolStaff', 'family', 'representative'], best: ['doctor'] },
  { id: 'interview', options: ['representative', 'friends', 'psychologist', 'resident'], best: ['representative'] },
  { id: 'school', options: ['schoolStaff', 'family', 'doctor', 'resident'], best: ['schoolStaff'] },
]

// Step types: info, self (true for you?), myth (did you know?), chain,
// storyChoice, story, emotions, helpers, summary, activities, activitySummary,
// rights (last screen of every chapter, same picture in all of them).
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
        type: 'rights',
        title: 'ch1.summary.title',
        items: ['ch1.summary.1', 'ch1.summary.2', 'ch1.summary.3', 'ch1.summary.4', 'ch1.summary.5', 'ch1.summary.6'],
        note: 'ch1.summary.note',
      },
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
      { type: 'storyChoice', id: 'ch2.story', text: 'ch2.story.choose', skipTo: 'first' },
      { type: 'story', storyFrom: 'ch2.story' },
      // Answers to these two are kept per story (e.g. "ch2.emotions.shut").
      { type: 'emotions', id: 'ch2.emotions', storyFrom: 'ch2.story' },
      { type: 'helpers', id: 'ch2.helpers', storyFrom: 'ch2.story' },
      { type: 'storyAgain', storyFrom: 'ch2.story' },
      { type: 'first', id: 'ch2.first' },
      {
        type: 'summary',
        title: 'ch2.summary.title',
        items: ['ch2.summary.1', 'ch2.summary.2', 'ch2.summary.3', 'ch2.summary.4'],
        staff: 'ch2.staff',
      },
      { type: 'rights', title: 'rights.title', items: ['ch2.rights.1', 'ch2.rights.2', 'ch2.rights.3', 'ch2.rights.4'], offerGame: true },
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
      { type: 'info', title: 'ch3.ask.title', text: 'ch3.ask.text', img: img('icon-care.png') },
      {
        type: 'activitySummary',
        activitiesFrom: 'ch3.activities',
        nextTitle: 'ch3.next.title',
        disclaimer: 'ch3.next.disclaimer',
        title: 'ch3.summary.title',
        items: ['ch3.summary.1', 'ch3.summary.2', 'ch3.summary.3', 'ch3.summary.4'],
      },
      { type: 'rights', title: 'rights.title', items: ['ch3.rights.1', 'ch3.rights.2', 'ch3.rights.3'] },
    ],
  },
]

// Chapters shown with the current feature switches: the workshop chapters plus
// any extra chapters that are switched on.
// Order of the topics in the overview: from who helps you and where you live,
// through everyday life and health, to safety, and complaints last.
const ORDER = ['ch1', 'x.centre', 'x.money', 'ch3', 'ch2', 'x.safety', 'x.cws', 'x.complain']
const rank = (ch) => (ORDER.includes(ch.id) ? ORDER.indexOf(ch.id) : ORDER.length)

export function chaptersFor(on) {
  return [...CHAPTERS, ...EXTRA_CHAPTERS.filter((ch) => on(ch.id))].sort((a, b) => rank(a) - rank(b))
}

export function findChapter(id) {
  return [...CHAPTERS, ...EXTRA_CHAPTERS].find((ch) => ch.id === id)
}

