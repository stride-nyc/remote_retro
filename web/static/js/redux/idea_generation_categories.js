import actionTypes from "./action_types"

const formatToCategoriesMap = {
  "Happy/Sad/Confused": ["happy", "sad", "confused"],
  "Start/Stop/Continue": ["start", "stop", "continue"],
}

 
export const reducer = (state = [], action) => {
  switch (action.type) {
    case actionTypes.SET_INITIAL_STATE: {
      const { initialState } = action
      return formatToCategoriesMap[initialState.format]
    }
    default:
      return state
  }
}
