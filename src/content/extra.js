// EXTRA content: not part of LFB's workshop. Built from LFB's rights
// information for unaccompanied minors aged 15–18 ("Rettighetsinformasjon for
// EMA mellom 15-18"), which also exists in 10 languages.
//
// Each chapter can be switched on and off in src/features.jsx (ids "x.*").
// To remove everything: delete this file, its import in src/content.js, the
// "x.*" entries in features.jsx and the "x." strings in strings.json.

const img = (file) => `${import.meta.env.BASE_URL}img/${file}`

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
      { type: 'myth', id: 'x.safety.family', correct: 'false' },
      { type: 'myth', id: 'x.safety.hit', correct: 'false' },
      { type: 'info', title: 'x.safety.body.title', text: 'x.safety.body.text' },
      {
        type: 'summary',
        title: 'x.safety.summary.title',
        items: ['x.safety.summary.1', 'x.safety.summary.2', 'x.safety.summary.3', 'x.safety.summary.4', 'x.safety.summary.5'],
        staff: 'x.safety.staff',
      },
      // Duties, from the workshop notes. The answer about leaving the centre is
      // a PLACEHOLDER until LFB has written what applies.
      { type: 'info', title: 'x.safety.leave.title', text: 'x.safety.leave.text', img: img('icon-map.png') },
      {
        type: 'rights',
        title: 'rights.title',
        items: ['x.safety.rights.1', 'x.safety.rights.2', 'x.safety.rights.3'],
        duties: { title: 'x.safety.duties.title', items: ['x.safety.duties.1', 'x.safety.duties.2', 'x.safety.duties.3'] },
      },
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
      { type: 'info', title: 'x.centre.say.title', text: 'x.centre.say.text' },
      { type: 'self', id: 'x.centre.say', img: img('thumbs-up.png') },
      { type: 'self', id: 'x.centre.info', img: img('icon-interpreter.png') },
      { type: 'info', title: 'x.centre.respect.title', text: 'x.centre.respect.text' },
      { type: 'myth', id: 'x.centre.phone', correct: 'false' },
      { type: 'info', title: 'x.centre.force.title', text: 'x.centre.force.text' },
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
      { type: 'rights', title: 'rights.title', items: ['x.cws.rights.1', 'x.cws.rights.2'] },
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
      { type: 'rights', title: 'rights.title', items: ['x.money.rights.1', 'x.money.rights.2', 'x.money.rights.3'] },
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
      { type: 'rights', title: 'rights.title', items: ['x.complain.rights.1', 'x.complain.rights.2', 'x.complain.rights.3'] },
    ],
  },
]
