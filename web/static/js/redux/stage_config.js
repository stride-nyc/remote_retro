import StageConfig from "../services/stage_config"
import actionTypes from "./action_types"

const _alertOmittedFromStageConfigFor = retroAttrs => {
  const { alert, ...stageConfigMinusAlert } = StageConfig.retrieveFor(retroAttrs)
  return stageConfigMinusAlert
}

export const reducer = (state = null, action) => {
  switch (action.type) {
    case actionTypes.SET_INITIAL_STATE: {
      const { initialState } = action
      return _alertOmittedFromStageConfigFor(initialState)
    }
    case actionTypes.RETRO_STAGE_PROGRESSION_COMMITTED: {
      const { payload } = action
      return _alertOmittedFromStageConfigFor(payload.retro)
    }
    default:
      return state
  }
}

export default reducer
