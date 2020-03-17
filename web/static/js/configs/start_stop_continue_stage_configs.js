import sharedStageConfigs from "./shared_stage_configs"
import stageChangeInfoIdeaGenerationBuilder from "../components/stage_change_info_idea_generation_builder"
import IdeationInterface from "../components/ideation_interface"
import STAGES from "./stages"

const {
  IDEA_GENERATION,
  GROUPING,
} = STAGES

const StageChangeInfoIdeaGeneration = stageChangeInfoIdeaGenerationBuilder([
  "Reflect on the practices and habits of the team.",
  "Suggest practices that the team could start, stop, or continue to make the team more effective.",
  "Be thoughtful with your language. We're here to improve the team.",
])

const ideaGenerationConfig = {
  arrivalAlert: {
    headerText: "Stage Change: Idea Generation!",
    BodyComponent: StageChangeInfoIdeaGeneration,
  },
  help: {
    headerText: "Idea Generation",
    BodyComponent: StageChangeInfoIdeaGeneration,
  },
  uiComponent: IdeationInterface,
  progressionButton: {
    nextStage: GROUPING,
    copy: "Grouping",
    iconClass: "arrow right",
    confirmationMessage: "Are you sure you would like to proceed to the idea grouping stage?",
    stateDependentTooltip: () => "New!",
  },
}

export default {
  ...sharedStageConfigs,
  [IDEA_GENERATION]: ideaGenerationConfig,
}
