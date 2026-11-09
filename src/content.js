
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
  // PLACEHOLDER picture until the illustrator has drawn this one.
  { id: 'crafts', img: img('activity-crafts-placeholder.svg') },
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
// The topics, in the order the overview shows them: from who helps you and
// where you live, through everyday life and health, to safety, and how to
// complain last. Texts starting with "x." come from LFB's rights information
// documents (not the workshop); the prefix is kept so the sheet's keys stay.
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
    id: 'x.centre',
    title: 'x.centre.title',
    subtitle: 'x.centre.subtitle',
    img: img('actor-centre-staff.jpg'),
    steps: [
      { type: 'info', title: 'x.centre.intro.title', text: 'x.centre.intro.text', img: img('icon-handshake.png') },
      { type: 'self', id: 'x.centre.plan', img: img('icon-map.png') },
      { type: 'info', title: 'x.centre.say.title', text: 'x.centre.say.text' },
      { type: 'self', id: 'x.centre.say', img: img('thumbs-up.png') },
      { type: 'self', id: 'x.centre.info', img: img('icon-interpreter.png') },
      { type: 'info', title: 'x.centre.respect.title', text: 'x.centre.respect.text' },
      { type: 'myth', id: 'x.centre.phone', correct: 'false' },
      { type: 'info', title: 'x.centre.force.title', text: 'x.centre.force.text' },
      // Leaving the centre and getting a lift (moved here from Safety at LFB's
      // request). The answer about leaving is a PLACEHOLDER until LFB has
      // checked the rules for leave.
      { type: 'info', title: 'x.centre.leave.title', text: 'x.centre.leave.text', img: img('icon-map.png') },
      { type: 'info', title: 'x.centre.car.title', text: 'x.centre.car.text' },
      {
        type: 'rights',
        title: 'x.centre.summary.title',
        items: ['x.centre.summary.1', 'x.centre.summary.2', 'x.centre.summary.3', 'x.centre.summary.4', 'x.centre.summary.5'],
        duties: {
          title: 'x.centre.duties.title',
          items: ['x.centre.duties.1', 'x.centre.duties.2', 'x.centre.duties.3', 'x.centre.duties.4', 'x.centre.duties.5'],
        },
      },
    ],
  },
  {
    id: 'x.money',
    title: 'x.money.title',
    subtitle: 'x.money.subtitle',
    img: img('activity-learn.jpg'),
    steps: [
      { type: 'info', title: 'x.money.intro.title', text: 'x.money.intro.text', img: img('activity-food.jpg') },
      { type: 'myth', id: 'x.money.rent', correct: 'false' },
      { type: 'info', title: 'x.money.school.title', text: 'x.money.school.text', img: img('activity-learn.jpg') },
      { type: 'self', id: 'x.money.inschool' },
      { type: 'rights', title: 'rights.title', items: ['x.money.rights.1', 'x.money.rights.2', 'x.money.rights.3'] },
    ],
  },
  {
    id: 'ch3',
    title: 'ch3.title',
    subtitle: 'ch3.subtitle',
    img: img('activity-sport.jpg'),
    steps: [
      { type: 'info', title: 'ch3.intro.title', text: 'ch3.intro.text', img: img('sunny-tree.png') },
      { type: 'myth', id: 'ch3.cost', correct: 'false' },
      { type: 'activities', id: 'ch3.activities' },
      {
        type: 'activitySummary',
        activitiesFrom: 'ch3.activities',
        nextTitle: 'ch3.next.title',
        disclaimer: 'ch3.next.disclaimer',
        title: 'ch3.summary.title',
        items: ['ch3.summary.1', 'ch3.summary.2', 'ch3.summary.3', 'ch3.summary.4'],
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
    id: 'x.safety',
    title: 'x.safety.title',
    subtitle: 'x.safety.subtitle',
    img: img('friends.png'),
    imgContain: true,
    steps: [
      { type: 'info', title: 'x.safety.intro.title', text: 'x.safety.intro.text', img: img('icon-care.png') },
      { type: 'info', title: 'x.safety.nsc.title', text: 'x.safety.nsc.text' },
      { type: 'myth', id: 'x.safety.family', correct: 'false' },
      { type: 'myth', id: 'x.safety.hit', correct: 'false' },
      { type: 'info', title: 'x.safety.body.title', text: 'x.safety.body.text' },
      {
        type: 'summary',
        title: 'x.safety.summary.title',
        items: ['x.safety.summary.1', 'x.safety.summary.2', 'x.safety.summary.3', 'x.safety.summary.4', 'x.safety.summary.5'],
        staff: 'x.safety.staff',
      },
      {
        type: 'rights',
        title: 'rights.title',
        items: ['x.safety.rights.1', 'x.safety.rights.2', 'x.safety.rights.3'],
        duties: { title: 'x.safety.duties.title', items: ['x.safety.duties.1', 'x.safety.duties.2', 'x.safety.duties.3'] },
      },
    ],
  },
  {
    id: 'x.cws',
    title: 'x.cws.title',
    subtitle: 'x.cws.subtitle',
    img: img('actor-family.jpg'),
    steps: [
      { type: 'info', title: 'x.cws.intro.title', text: 'x.cws.intro.text', img: img('icon-care.png') },
      { type: 'myth', id: 'x.cws.asylum', correct: 'false' },
      { type: 'info', title: 'x.cws.when.title', text: 'x.cws.when.text' },
      {
        type: 'summary',
        title: 'x.cws.summary.title',
        items: ['x.cws.summary.1', 'x.cws.summary.2', 'x.cws.summary.3'],
        staff: 'x.cws.staff',
      },
      { type: 'info', title: 'x.cws.what.title', text: 'x.cws.what.text' },
      { type: 'rights', title: 'rights.title', items: ['x.cws.rights.1', 'x.cws.rights.2'] },
    ],
  },
  {
    id: 'x.complain',
    title: 'x.complain.title',
    subtitle: 'x.complain.subtitle',
    img: img('thumbs-up.png'),
    imgContain: true,
    steps: [
      { type: 'info', title: 'x.complain.intro.title', text: 'x.complain.intro.text', img: img('thumbs-up.png') },
      { type: 'routes', title: 'x.complain.routes.title', routes: ['x.complain.r1', 'x.complain.r2', 'x.complain.r3', 'x.complain.r4'] },
      { type: 'rights', title: 'rights.title', items: ['x.complain.rights.1', 'x.complain.rights.2', 'x.complain.rights.3'] },
    ],
  },
]

export function findChapter(id) {
  return CHAPTERS.find((ch) => ch.id === id)
}

