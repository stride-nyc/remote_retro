import StageChangeInfoVoting from "../components/stage_change_info_voting"
import StageChangeInfoIdeaGeneration from "../components/stage_change_info_idea_generation"
import StageChangeInfoGrouping from "../components/stage_change_info_grouping"
import StageChangeInfoClosed from "../components/stage_change_info_closed"
import StageChangeInfoActionItems from "../components/stage_change_info_action_items"
import StageChangeInfoPrimeDirective from "../components/stage_change_info_prime_directive"
import STAGES from "./stages"

const {
  LOBBY,
  PRIME_DIRECTIVE,
  IDEA_GENERATION,
  GROUPING,
  VOTING,
  ACTION_ITEMS,
  CLOSED,
} = STAGES

const baseIdeaGenerationConfig = {
  alert: {
    headerText: "Stage Change: Idea Generation!",
    BodyComponent: StageChangeInfoIdeaGeneration,
  },
}
const ideaGenerationConfig = localStorage.groupingDev ? {
  ...baseIdeaGenerationConfig,
  confirmationMessage: "Are you sure you would like to proceed to the grouping stage?",
  nextStage: GROUPING,
  progressionButton: {
    copy: "Proceed to Grouping",
    iconClass: "arrow right",
  },
} : {
  ...baseIdeaGenerationConfig,
  confirmationMessage: "Are you sure you would like to proceed to the voting stage?",
  nextStage: VOTING,
  progressionButton: {
    copy: "Proceed to Voting",
    iconClass: "arrow right",
  },
}

export default {
  [LOBBY]: {
    alert: null,
    confirmationMessage: "Has your entire party arrived?",
    nextStage: PRIME_DIRECTIVE,
    progressionButton: {
      copy: "Begin Retro",
      iconClass: "arrow right",
    },
  },
  [PRIME_DIRECTIVE]: {
    alert: {
      headerText: "Stage Change: The Prime Directive!",
      BodyComponent: StageChangeInfoPrimeDirective,
    },
    confirmationMessage: "Is everyone ready to begin?",
    nextStage: IDEA_GENERATION,
    progressionButton: {
      copy: "Proceed to Idea Generation",
      iconClass: "arrow right",
    },
  },
  [IDEA_GENERATION]: ideaGenerationConfig,
  [GROUPING]: {
    alert: {
      headerText: "Stage Change: Grouping!",
      BodyComponent: StageChangeInfoGrouping,
    },
    confirmationMessage: "Are you sure you would like to proceed to the voting stage?",
    nextStage: VOTING,
    progressionButton: {
      copy: "Proceed to Voting",
      iconClass: "arrow right",
    },
  },
  [VOTING]: {
    alert: {
      headerText: "Stage Change: Voting!",
      BodyComponent: StageChangeInfoVoting,
    },
    confirmationMessage: "Are you sure you would like to proceed to the action items stage?",
    nextStage: ACTION_ITEMS,
    progressionButton: {
      copy: "Proceed to Action Items",
      iconClass: "arrow right",
    },
  },
  [ACTION_ITEMS]: {
    alert: {
      headerText: "Stage Change: Action-Item Generation!",
      BodyComponent: StageChangeInfoActionItems,
    },
    confirmationMessage: "Are you sure you want to distribute this retrospective's action items? This will close the retro.",
    nextStage: CLOSED,
    progressionButton: {
      copy: "Send Action Items",
      iconClass: "send",
    },
  },
  [CLOSED]: {
    alert: {
      headerText: "Retro: Closed!",
      BodyComponent: StageChangeInfoClosed,
    },
    confirmationMessage: null,
    nextStage: null,
    progressionButton: null,
  },
}
