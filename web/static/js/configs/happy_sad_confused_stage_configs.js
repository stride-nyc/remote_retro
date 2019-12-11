import sharedStageConfigs from "./shared_stage_configs"
import StageChangeInfoVoting from "../components/stage_change_info_voting"
import IdeasWithEphemeralGroupingIds from "../services/ideas_with_ephemeral_grouping_ids"
import stageChangeInfoIdeaGenerationBuilder from "../components/stage_change_info_idea_generation_builder"
import StageChangeInfoGrouping from "../components/stage_change_info_grouping"
import StageChangeInfoGroupNaming from "../components/stage_change_info_group_naming"
import StageChangeInfoClosed from "../components/stage_change_info_closed"
import StageChangeInfoActionItems from "../components/stage_change_info_action_items"
import STAGES from "./stages"
import { VOTE_LIMIT } from "./retro_configs"

const {
  IDEA_GENERATION,
  GROUPING,
  GROUP_NAMING,
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
    copy: "Proceed to Idea Grouping",
    iconClass: "arrow right",
    confirmationMessage: "Are you sure you would like to proceed to the idea grouping stage?",
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
  ...sharedStageConfigs,
  [IDEA_GENERATION]: ideaGenerationConfig,
  [GROUPING]: {
    arrivalAlert: {
      headerText: "Stage Change: Idea Grouping!",
      BodyComponent: StageChangeInfoGrouping,
    },
    help: {
      headerText: "Idea Grouping",
      BodyComponent: StageChangeInfoGrouping,
    },
    progressionButton: {
      nextStage: GROUP_NAMING,
      optionalParamsAugmenter: reduxState => ({
        ideasWithEphemeralGroupingIds: IdeasWithEphemeralGroupingIds.buildFrom(reduxState.ideas),
      }),
      copy: "Proceed to Group Naming",
      iconClass: "arrow right",
      confirmationMessage: "Has your team finished grouping the ideas?",
    },
  },
  [GROUP_NAMING]: {
    arrivalAlert: {
      headerText: "Stage Change: Group Naming!",
      BodyComponent: StageChangeInfoGroupNaming,
    },
    help: {
      headerText: "Group Naming",
      BodyComponent: StageChangeInfoGroupNaming,
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
