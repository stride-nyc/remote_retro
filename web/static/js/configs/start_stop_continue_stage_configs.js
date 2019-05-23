import StageChangeInfoVoting from "../components/stage_change_info_voting"
import stageChangeInfoIdeaGenerationBuilder from "../components/stage_change_info_idea_generation_builder"
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

const StageChangeInfoIdeaGeneration = stageChangeInfoIdeaGenerationBuilder([
  "Reflect on the practices and habits of the team.",
  "Suggest practices that the team could start, stop, or continue to make the team more effective.",
  "Be thoughful with your language. You're here to improve the team.",
])

export default {
  [LOBBY]: {
    alert: null,
    help: null,
    nextStage: PRIME_DIRECTIVE,
    progressionButton: {
      copy: "Begin Retro",
      iconClass: "arrow right",
      confirmationMessage: "Has your entire party arrived?",
    },
  },
  [PRIME_DIRECTIVE]: {
    alert: {
      headerText: "Stage Change: The Prime Directive!",
      BodyComponent: StageChangeInfoPrimeDirective,
    },
    help: {
      headerText: "The Prime Directive",
      BodyComponent: StageChangeInfoPrimeDirective,
    },
    nextStage: IDEA_GENERATION,
    progressionButton: {
      copy: "Proceed to Idea Generation",
      iconClass: "arrow right",
      confirmationMessage: "Is everyone ready to begin?",
    },
  },
  [IDEA_GENERATION]: {
    alert: {
      headerText: "Stage Change: Idea Generation!",
      BodyComponent: StageChangeInfoIdeaGeneration,
    },
    help: {
      headerText: "Idea Generation",
      BodyComponent: StageChangeInfoIdeaGeneration,
    },
    nextStage: VOTING,
    progressionButton: {
      copy: "Proceed to Voting",
      iconClass: "arrow right",
      confirmationMessage: "Are you sure you would like to proceed to the voting stage?",
    },
  },
  [GROUPING]: {
    alert: {
      headerText: "Stage Change: Grouping!",
      BodyComponent: StageChangeInfoGrouping,
    },
    help: {
      headerText: "Grouping",
      BodyComponent: StageChangeInfoGrouping,
    },
    nextStage: VOTING,
    progressionButton: {
      copy: "Proceed to Voting",
      iconClass: "arrow right",
      confirmationMessage: "Are you sure you would like to proceed to the voting stage?",
    },
  },
  [VOTING]: {
    alert: {
      headerText: "Stage Change: Voting!",
      BodyComponent: StageChangeInfoVoting,
    },
    help: {
      headerText: "Voting",
      BodyComponent: StageChangeInfoVoting,
    },
    nextStage: ACTION_ITEMS,
    progressionButton: {
      copy: "Proceed to Action Items",
      iconClass: "arrow right",
      confirmationMessage: "Are you sure you would like to proceed to the action items stage?",
    },
  },
  [ACTION_ITEMS]: {
    alert: {
      headerText: "Stage Change: Action-Item Generation!",
      BodyComponent: StageChangeInfoActionItems,
    },
    help: {
      headerText: "Action-Item Generation",
      BodyComponent: StageChangeInfoActionItems,
    },
    nextStage: CLOSED,
    progressionButton: {
      copy: "Send Action Items",
      iconClass: "send",
      confirmationMessage: "Are you sure you want to distribute this retrospective's action items? This will close the retro.",
    },
  },
  [CLOSED]: {
    alert: {
      headerText: "Retro: Closed!",
      BodyComponent: StageChangeInfoClosed,
    },
    help: {
      headerText: "Retro is Closed!",
      BodyComponent: StageChangeInfoClosed,
    },
    nextStage: null,
    progressionButton: null,
  },
}
