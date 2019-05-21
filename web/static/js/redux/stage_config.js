import StageConfig from "../services/stage_config"
import { types as retroTypes } from "./retro"

const _alertOmittedFromStageConfigFor = stage => {
  const { alert, ...stageConfigMinusAlert } = StageConfig.retrieveFor(stage)
  return stageConfigMinusAlert
}

export const reducer = (state = null, action) => {
  switch (action.type) {
    case retroTypes.SET_INITIAL_STATE: {
      const { initialState } = action
      return _alertOmittedFromStageConfigFor(initialState.stage)
    }
    case retroTypes.RETRO_UPDATE_COMMITTED: {
      const { retroChanges } = action
      return _alertOmittedFromStageConfigFor(retroChanges.stage)
    }
    default:
      return state
  }
}

export default reducer
