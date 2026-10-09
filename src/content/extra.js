// EXTRA content: not part of LFB's workshop. Built from LFB's rights
// information for unaccompanied minors aged 15–18 ("Rettighetsinformasjon for
// EMA mellom 15-18"), which also exists in 10 languages.
//
// Each chapter can be switched on and off in src/features.jsx (ids "x.*").
// To remove everything: delete this file, its import in src/content.js, the
// "x.*" entries in features.jsx and the "x." strings in strings.json.

const img = (file) => `${import.meta.env.BASE_URL}img/${file}`

export const EXTRA_CARDS = {
  'x.safety': { text: 'x.safety.card', img: img('friends.png'), cutout: true },
  'x.centre': { text: 'x.centre.card', img: img('actor-centre-staff.jpg') },
  'x.cws': { text: 'x.cws.card', img: img('actor-family.jpg') },
  'x.money': { text: 'x.money.card', img: img('activity-learn.jpg') },
  'x.complain': { text: 'x.complain.card', img: img('thumbs-up.png'), cutout: true },
}

export const EXTRA_CHAPTERS = [
  {
    id: 'x.safety',
    extra: true,
    title: 'x.safety.title',
    subtitle: 'x.safety.subtitle',
    img: img('friends.png'),
    imgContain: true,
    steps: [
      { type: 'info', title: 'x.safety.intro.title', text: 'x.safety.intro.text', img: img('icon-care.png') },
      { type: 'info', title: 'x.safety.nsc.title', text: 'x.safety.nsc.text' },
      { type: 'myth', id: 'x.safety.hit', correct: 'false' },
      {
        type: 'summary',
        title: 'x.safety.summary.title',
        items: ['x.safety.summary.1', 'x.safety.summary.2', 'x.safety.summary.3'],
        staff: 'x.safety.staff',
      },
      { type: 'card', card: 'x.safety' },
    ],
  },
  {
    id: 'x.centre',
    extra: true,
    title: 'x.centre.title',
    subtitle: 'x.centre.subtitle',
    img: img('actor-centre-staff.jpg'),
    steps: [
      { type: 'info', title: 'x.centre.intro.title', text: 'x.centre.intro.text', img: img('icon-handshake.png') },
      { type: 'self', id: 'x.centre.plan', img: img('icon-map.png') },
      { type: 'self', id: 'x.centre.info', img: img('icon-interpreter.png') },
      { type: 'myth', id: 'x.centre.phone', correct: 'false' },
      {
        type: 'summary',
        title: 'x.centre.summary.title',
        items: ['x.centre.summary.1', 'x.centre.summary.2', 'x.centre.summary.3', 'x.centre.summary.4', 'x.centre.summary.5'],
      },
      { type: 'card', card: 'x.centre' },
    ],
  },
  {
    id: 'x.cws',
    extra: true,
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
      { type: 'card', card: 'x.cws' },
    ],
  },
  {
    id: 'x.money',
    extra: true,
    title: 'x.money.title',
    subtitle: 'x.money.subtitle',
    img: img('activity-learn.jpg'),
    steps: [
      { type: 'info', title: 'x.money.intro.title', text: 'x.money.intro.text', img: img('activity-food.jpg') },
      { type: 'myth', id: 'x.money.rent', correct: 'false' },
      { type: 'info', title: 'x.money.school.title', text: 'x.money.school.text', img: img('activity-learn.jpg') },
      { type: 'self', id: 'x.money.inschool' },
      { type: 'card', card: 'x.money' },
    ],
  },
  {
    id: 'x.complain',
    extra: true,
    title: 'x.complain.title',
    subtitle: 'x.complain.subtitle',
    img: img('thumbs-up.png'),
    imgContain: true,
    steps: [
      { type: 'info', title: 'x.complain.intro.title', text: 'x.complain.intro.text', img: img('thumbs-up.png') },
      { type: 'routes', title: 'x.complain.routes.title', routes: ['x.complain.r1', 'x.complain.r2', 'x.complain.r3', 'x.complain.r4'] },
      { type: 'card', card: 'x.complain' },
    ],
  },
]
