import { types as retroTypes } from "./retro"

const types = {
  CATEGORY_TAB_SELECTED: "CATEGORY_TAB_SELECTED",
}

export const actions = {
  categoryTabSelected: category => ({ type: types.CATEGORY_TAB_SELECTED, category }),
}

const formatToSelectedCategory = {
  "Happy/Sad/Confused": "happy",
  "Start/Stop/Continue": "start",
}

export const reducer = (state = {}, action) => {
  switch (action.type) {
    case retroTypes.SET_INITIAL_STATE: {
      const { initialState } = action
      return { selectedCategoryTab: formatToSelectedCategory[initialState.format] }
    }
    case types.CATEGORY_TAB_SELECTED:
      return { ...state, selectedCategoryTab: action.category }
    default:
      return state
  }
}
