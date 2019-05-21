import stageConfigs from "../configs/stage_configs"

export default {
  retrieveFor: stage => {
    const stageConfig = stageConfigs[stage]

    if (!stageConfig) {
      throw new Error(
        `No stage configuration found for '${stage}' stage. Please ensure you're providing a valid stage.`
      )
    }

    return stageConfig
  },
}
