import { types as retroTypes } from "./retro"

const formatToCategoriesMap = {
  "Happy/Sad/Confused": ["happy", "sad", "confused"],
  "Start/Stop/Continue": ["start", "stop", "continue"],
}

// eslint-disable-next-line import/prefer-default-export
export const reducer = (state = [], action) => {
  switch (action.type) {
    case retroTypes.SET_INITIAL_STATE: {
      const { initialState } = action
      return formatToCategoriesMap[initialState.format]
    }
    default:
      return state
  }
}
