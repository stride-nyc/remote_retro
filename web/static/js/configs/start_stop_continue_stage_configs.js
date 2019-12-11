import sharedStageConfigs from "./shared_stage_configs"
import StageChangeInfoVoting from "../components/stage_change_info_voting"
import stageChangeInfoIdeaGenerationBuilder from "../components/stage_change_info_idea_generation_builder"
import StageChangeInfoGrouping from "../components/stage_change_info_grouping"
import StageChangeInfoClosed from "../components/stage_change_info_closed"
import StageChangeInfoActionItems from "../components/stage_change_info_action_items"
import STAGES from "./stages"
import { VOTE_LIMIT } from "./retro_configs"

const {
  IDEA_GENERATION,
  GROUPING,
  VOTING,
  ACTION_ITEMS,
  CLOSED,
} = STAGES

const StageChangeInfoIdeaGeneration = stageChangeInfoIdeaGenerationBuilder([
  "Reflect on the practices and habits of the team.",
  "Suggest practices that the team could start, stop, or continue to make the team more effective.",
  "Be thoughtful with your language. We're here to improve the team.",
])

export default {
  ...sharedStageConfigs,
  [IDEA_GENERATION]: {
    arrivalAlert: {
      headerText: "Stage Change: Idea Generation!",
      BodyComponent: StageChangeInfoIdeaGeneration,
    },
    help: {
      headerText: "Idea Generation",
      BodyComponent: StageChangeInfoIdeaGeneration,
    },
    progressionButton: {
      nextStage: VOTING,
      copy: "Proceed to Voting",
      iconClass: "arrow right",
      confirmationMessage: "Are you sure you would like to proceed to the voting stage?",
    },
  },
  [GROUPING]: {
    arrivalAlert: {
      headerText: "Stage Change: Grouping!",
      BodyComponent: StageChangeInfoGrouping,
    },
    help: {
      headerText: "Grouping",
      BodyComponent: StageChangeInfoGrouping,
    },
    progressionButton: {
      nextStage: VOTING,
      copy: "Proceed to Voting",
      iconClass: "arrow right",
      confirmationMessage: "Are you sure you would like to proceed to the voting stage?",
    },
  },
  [VOTING]: {
    arrivalAlert: {
      headerText: "Stage Change: Voting!",
      BodyComponent: StageChangeInfoVoting,
    },
    help: {
      headerText: "Voting",
      BodyComponent: StageChangeInfoVoting,
    },
    progressionButton: {
      nextStage: ACTION_ITEMS,
      copy: "Proceed to Action Items",
      iconClass: "arrow right",
      confirmationMessage: "Are you sure you would like to proceed to the action items stage?",
      stateDependentTooltip: reduxState => {
        const { votes, presences } = reduxState
        const TOTAL_VOTE_LIMIT_FOR_RETRO = VOTE_LIMIT * presences.length

        if (votes.length >= TOTAL_VOTE_LIMIT_FOR_RETRO) {
          return "All votes in!"
        }
        return null
      },
    },
  },
  [ACTION_ITEMS]: {
    arrivalAlert: {
      headerText: "Stage Change: Action-Item Generation!",
      BodyComponent: StageChangeInfoActionItems,
    },
    help: {
      headerText: "Action-Item Generation",
      BodyComponent: StageChangeInfoActionItems,
    },
    progressionButton: {
      nextStage: CLOSED,
      copy: "Send Action Items",
      iconClass: "send",
      confirmationMessage: "Are you sure you want to distribute this retrospective's action items? This will close the retro.",
    },
  },
  [CLOSED]: {
    arrivalAlert: {
      headerText: "Retro: Closed!",
      BodyComponent: StageChangeInfoClosed,
    },
    help: {
      headerText: "Retro is Closed!",
      BodyComponent: StageChangeInfoClosed,
    },
    progressionButton: null,
  },
}
