import formats from "../configs/formats"

let formatReference
export default {
  retrieveFor: ({ format, stage }) => {
    // we keep a reference to the retro format via module closure,
    // as we need to support reducers *lacking* a reference to the format after
    // the application has bootstrapped. We could repeatedly supply the format
    // in our action creators, but we elect to add complexity here to make it
    // easier on our consumers
    if (format) { formatReference = format }

    const formatSpecificStageConfigs = formats[formatReference]

    if (!formatSpecificStageConfigs) {
      throw new Error(`No format configuration found for '${formatReference}'.`)
    }

    const stageConfig = formats[formatReference][stage]

    if (!stageConfig) {
      throw new Error(`No stage configuration found for '${stage}'.`)
    }

    return stageConfig
  },
}
