import actionTypes from "./action_types"

const INITIAL_STATE = {
  highContrastOn: false,
}

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_HIGH_CONTRAST_ON:
      return { highContrastOn: !state.highContrastOn }
    default:
      return state
  }
}

export const actions = {
  toggleHighContrastOn: () => ({ type: actionTypes.TOGGLE_HIGH_CONTRAST_ON }),
}
