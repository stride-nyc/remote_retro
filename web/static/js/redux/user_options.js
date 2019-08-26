const INITIAL_STATE = {
  highContrastOn: false,
}

export const types = {
  TOGGLE_HIGH_CONTRAST_ON: "TOGGLE_HIGH_CONTRAST_ON",
}

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.TOGGLE_HIGH_CONTRAST_ON:
      return { highContrastOn: !state.highContrastOn }
    default:
      return state
  }
}

export const actions = {
  toggleHighContrastOn: () => ({ type: types.TOGGLE_HIGH_CONTRAST_ON }),
}
