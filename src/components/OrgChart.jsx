import { useI18n } from '../i18n/I18n.jsx'

// Who is responsible for what, drawn after LFB's slide 8 ("Hvem er vi i
// forhold til andre?"). Built from text, not an image, so every label can be
// translated. In right-to-left languages the grid mirrors by itself.
//
//   UDI          Bufdir
//    | Ansvar      |
//   Asylmottak   Barnevern
//    | Hjelper     ^
//   Asylsøker <- LFB
const BOXES = ['udi', 'bufdir', 'centre', 'cws', 'you', 'lfb']

export const orgChartText = (t) =>
  [
    ...['udi', 'centre', 'you', 'bufdir', 'cws', 'lfb'].map((k) => `${t(`orgchart.${k}.name`)}: ${t(`orgchart.${k}.text`)}.`),
    `${t('orgchart.udi.name')} → ${t('orgchart.centre.name')}: ${t('orgchart.udiCentre')}.`,
    `${t('orgchart.centre.name')} → ${t('orgchart.you.name')}: ${t('orgchart.centreYou')}.`,
    `${t('orgchart.lfb.name')} → ${t('orgchart.you.name')}: ${t('orgchart.lfbYou')}.`,
  ].join(' ')

function Box({ id }) {
  const { t } = useI18n()
  return (
    <div className={`org-box org-${id}`}>
      <strong>{t(`orgchart.${id}.name`)}</strong>
      <span>{t(`orgchart.${id}.text`)}</span>
    </div>
  )
}

const Down = ({ label, up }) => (
  <div className={`org-arrow ${up ? 'up' : ''}`} aria-hidden={!label}>
    <span className="org-line" />
    {label && <span className="org-label">{label}</span>}
  </div>
)

export default function OrgChart() {
  const { t } = useI18n()
  const [udi, bufdir, centre, cws, you, lfb] = BOXES
  return (
    <figure className="org-chart" aria-label={orgChartText(t)}>
      <div className="org-grid" aria-hidden="true">
        <Box id={udi} />
        <span />
        <Box id={bufdir} />
        <Down label={t('orgchart.udiCentre')} />
        <span />
        <Down />
        <Box id={centre} />
        <span />
        <Box id={cws} />
        <Down label={t('orgchart.centreYou')} />
        <span />
        <Down up />
        <Box id={you} />
        <div className="org-arrow side">
          <span className="org-label">{t('orgchart.lfbYou')}</span>
          <span className="org-line" />
        </div>
        <Box id={lfb} />
      </div>
    </figure>
  )
}
