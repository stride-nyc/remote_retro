import actionTypes from "./action_types"

export const actions = {
  categoryTabSelected: category => ({ type: actionTypes.CATEGORY_TAB_SELECTED, category }),
}

const formatToSelectedCategory = {
  "Happy/Sad/Confused": "happy",
  "Start/Stop/Continue": "start",
}

export const reducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.SET_INITIAL_STATE: {
      const { initialState } = action
      return { selectedCategoryTab: formatToSelectedCategory[initialState.format] }
    }
    case actionTypes.CATEGORY_TAB_SELECTED:
      return { ...state, selectedCategoryTab: action.category }
    default:
      return state
  }
}
