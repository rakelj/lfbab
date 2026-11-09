// Every step type a chapter can use, by the `type` name in src/content.js.
import { InfoStep, SummaryStep, RoutesStep, RightsStep } from './TextSteps.jsx'
import { SelfStep, MythStep } from './QuestionSteps.jsx'
import { StoryChoiceStep, StoryStep, EmotionsStep, HelpersStep, StoryAgainStep } from './StorySteps.jsx'
import { ChainStep, FirstStep } from './BodySteps.jsx'
import { ActivitiesStep, ActivitySummaryStep } from './ActivitySteps.jsx'

export const STEPS = {
  info: InfoStep,
  self: SelfStep,
  myth: MythStep,
  chain: ChainStep,
  storyChoice: StoryChoiceStep,
  story: StoryStep,
  emotions: EmotionsStep,
  helpers: HelpersStep,
  storyAgain: StoryAgainStep,
  first: FirstStep,
  activities: ActivitiesStep,
  activitySummary: ActivitySummaryStep,
  routes: RoutesStep,
  summary: SummaryStep,
  rights: RightsStep,
}
