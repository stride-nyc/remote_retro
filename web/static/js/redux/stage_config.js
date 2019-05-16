import StageConfig from "../services/stage_config"
import { types as retroTypes } from "./retro"

const _alertOmittedFromStageConfigFor = retroAttrs => {
  const { alert, ...stageConfigMinusAlert } = StageConfig.retrieveFor(retroAttrs)
  return stageConfigMinusAlert
}

export const reducer = (state = null, action) => {
  switch (action.type) {
    case retroTypes.SET_INITIAL_STATE: {
      const { initialState } = action
      return _alertOmittedFromStageConfigFor(initialState)
    }
    case retroTypes.RETRO_STAGE_PROGRESSION_COMMITTED: {
      const { retroChanges } = action
      return _alertOmittedFromStageConfigFor(retroChanges)
    }
    default:
      return state
  }
}

export default reducer
