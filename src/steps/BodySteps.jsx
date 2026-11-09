import { useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import { Speak } from '../components/Sound.jsx'
import { ActorInfoModal } from '../components/ActorCard.jsx'
import { ACTORS, img } from '../content.js'
import { useCardNames } from '../components/CardName.jsx'
import { useBack, PAGE } from '../nav.js'
import { StepNav, ActorGrid } from './shared.jsx'

// Body and mind: the sleep, body and mind chain, and "Who would you talk to first?".

// Body and mind: reveal the chain one link at a time. Back steps back through the links.
export function ChainStep({ onNext, onBack, cameBack }) {
  const { t } = useI18n()
  const links = ['ch2.chain.1', 'ch2.chain.2', 'ch2.chain.3']
  const [shown, setShown] = useState(cameBack ? links.length + 1 : 1)
  const complete = shown > links.length
  useBack(PAGE, () => (setShown(shown - 1), true), shown > 1)

  return (
    <>
      <h1>
        {t('ch2.chain.title')}{' '}
        <Speak text={[t('ch2.chain.title'), ...links.slice(0, shown).map((k) => t(k)), complete ? t('ch2.chain.text') : ''].join(' ')} />
      </h1>
      {/* Each link brings in its own figure (split from LFB's drawing), with an arrow between */}
      <ol className="chain">
        {links.slice(0, shown).map((k, i) => (
          <li key={k} className="chain-link">
            {i > 0 && (
              <span className="chain-arrow" aria-hidden="true">
                ↓
              </span>
            )}
            <span className="chain-row">
              <img src={img(`health-figure-${i + 1}.webp`)} alt="" />
              <span>{t(k)}</span>
            </span>
          </li>
        ))}
      </ol>
      {complete && (
        <>
          <img className="illustration" src={img('health-cycle.webp')} alt="" />
          <p className="lead">{t('ch2.chain.text')}</p>
        </>
      )}
      <StepNav onBack={shown > 1 ? () => setShown(shown - 1) : onBack} onNext={complete ? onNext : () => setShown(shown + 1)} />
    </>
  )
}

// "Who would you talk to first?": one personal choice. Tapping a card opens
// its text (the back of LFB's card), with a button to choose that person.
export function FirstStep({ step, value, onChange, onNext, onBack }) {
  const actorNames = useCardNames(ACTORS.map((a) => `actor.${a.id}`), { overlay: true })
  const { t } = useI18n()
  const [open, setOpen] = useState(null)
  const actor = ACTORS.find((a) => a.id === open)
  return (
    <>
      <h1>
        {t(`${step.id}.title`)} <Speak text={`${t(`${step.id}.title`)} ${t(`${step.id}.text`)} ${actorNames}`} />
      </h1>
      <p className="lead">{t(`${step.id}.text`)}</p>
      <ActorGrid picked={value ? [value] : []} onPick={setOpen} />
      {value && (
        <p className="reassure">
          {t(`${step.id}.after`)} <Speak text={t(`${step.id}.after`)} />
        </p>
      )}
      {actor && (
        <ActorInfoModal
          actor={actor}
          onClose={() => setOpen(null)}
          action={{
            label: t(`${step.id}.choose`),
            onClick: () => {
              onChange(actor.id)
              setOpen(null)
            },
          }}
        />
      )}
      <StepNav onBack={onBack} onNext={onNext} nextLabel={value ? undefined : t('common.skip')} />
    </>
  )
}
