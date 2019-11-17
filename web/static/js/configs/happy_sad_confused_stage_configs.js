import StageChangeInfoVoting from "../components/stage_change_info_voting"
import IdeasWithEphemeralGroupingIds from "../services/ideas_with_ephemeral_grouping_ids"
import stageChangeInfoIdeaGenerationBuilder from "../components/stage_change_info_idea_generation_builder"
import StageChangeInfoGrouping from "../components/stage_change_info_grouping"
import StageChangeInfoClosed from "../components/stage_change_info_closed"
import StageChangeInfoActionItems from "../components/stage_change_info_action_items"
import StageChangeInfoPrimeDirective from "../components/stage_change_info_prime_directive"
import STAGES from "./stages"
import { VOTE_LIMIT } from "./retro_configs"

const {
  LOBBY,
  PRIME_DIRECTIVE,
  IDEA_GENERATION,
  GROUPING,
  VOTING,
  ACTION_ITEMS,
  CLOSED,
} = STAGES

const StageChangeInfoIdeaGeneration = stageChangeInfoIdeaGenerationBuilder([
  "Reflect on the events of this past sprint.",
  "Submit items that made you happy, sad, or just plain confused.",
  "Assume best intent; we're all here to improve.",
])

const baseIdeaGenerationConfig = {
  arrivalAlert: {
    headerText: "Stage Change: Idea Generation!",
    BodyComponent: StageChangeInfoIdeaGeneration,
  },
  help: {
    headerText: "Idea Generation",
    BodyComponent: StageChangeInfoIdeaGeneration,
  },
}
const ideaGenerationConfig = localStorage.groupingDev ? {
  ...baseIdeaGenerationConfig,
  progressionButton: {
    nextStage: GROUPING,
    copy: "Proceed to Grouping",
    iconClass: "arrow right",
    confirmationMessage: "Are you sure you would like to proceed to the grouping stage?",
  },
} : {
  ...baseIdeaGenerationConfig,
  progressionButton: {
    nextStage: VOTING,
    copy: "Proceed to Voting",
    iconClass: "arrow right",
    confirmationMessage: "Are you sure you would like to proceed to the voting stage?",
  },
}

export default {
  [LOBBY]: {
    arrivalAlert: null,
    help: null,
    progressionButton: {
      nextStage: PRIME_DIRECTIVE,
      copy: "Begin Retro",
      iconClass: "arrow right",
      confirmationMessage: "Has your entire party arrived?",
    },
  },
  [PRIME_DIRECTIVE]: {
    arrivalAlert: {
      headerText: "Stage Change: The Prime Directive!",
      BodyComponent: StageChangeInfoPrimeDirective,
    },
    help: {
      headerText: "The Prime Directive",
      BodyComponent: StageChangeInfoPrimeDirective,
    },
    progressionButton: {
      nextStage: IDEA_GENERATION,
      copy: "Proceed to Idea Generation",
      iconClass: "arrow right",
      confirmationMessage: "Is everyone ready to begin?",
    },
  },
  [IDEA_GENERATION]: ideaGenerationConfig,
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
      optionalParamsAugmenter: reduxState => ({
        ideasWithEphemeralGroupingIds: IdeasWithEphemeralGroupingIds.buildFrom(reduxState.ideas),
      }),
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
          return "All Votes in!"
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
