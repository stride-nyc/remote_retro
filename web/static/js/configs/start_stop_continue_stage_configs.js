import sharedStageConfigs from "./shared_stage_configs"
import stageChangeInfoIdeaGenerationBuilder from "../components/stage_change_info_idea_generation_builder"
import IdeationInterface from "../components/ideation_interface"
import STAGES from "./stages"

const {
  IDEA_GENERATION,
  GROUPING,
  VOTING,
} = STAGES

const StageChangeInfoIdeaGeneration = stageChangeInfoIdeaGenerationBuilder([
  "Reflect on the practices and habits of the team.",
  "Suggest practices that the team could start, stop, or continue to make the team more effective.",
  "Be thoughtful with your language. We're here to improve the team.",
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
  uiComponent: IdeationInterface,
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
}
