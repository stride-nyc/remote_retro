import { types as retroTypes } from "./retro"

// eslint-disable-next-line import/prefer-default-export
export const reducer = (state = [], action) => {
  switch (action.type) {
    case retroTypes.SET_INITIAL_STATE:
      return action.initialState.groups
    case retroTypes.RETRO_STAGE_PROGRESSION_COMMITTED:
      return action.payload.groups ? action.payload.groups : state
    default:
      return state
  }
}
