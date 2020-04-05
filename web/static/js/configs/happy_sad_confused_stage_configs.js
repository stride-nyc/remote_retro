import sharedStageConfigs from "./shared_stage_configs"
import IdeationInterface from "../components/ideation_interface"
import stageChangeInfoIdeaGenerationBuilder from "../components/stage_change_info_idea_generation_builder"
import STAGES from "./stages"

const {
  IDEA_GENERATION,
  GROUPING,
} = STAGES

const StageChangeInfoIdeaGeneration = stageChangeInfoIdeaGenerationBuilder([
  "Reflect on the events of this past sprint.",
  "Submit items that made you happy, sad, or just plain confused.",
  "Assume best intent; we're all here to improve.",
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
  },
}

export default {
  ...sharedStageConfigs,
  [IDEA_GENERATION]: ideaGenerationConfig,
}
