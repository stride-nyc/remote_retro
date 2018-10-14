const types = {
  CATEGORY_TAB_SELECTED: "CATEGORY_TAB_SELECTED",
}

export const actions = {
  categoryTabSelected: category => ({ type: types.CATEGORY_TAB_SELECTED, category }),
}

const defaultInitialState = {
  selectedCategoryTab: "happy",
}

export const reducer = (state = defaultInitialState, action) => {
  switch (action.type) {
    case types.CATEGORY_TAB_SELECTED:
      return { ...state, selectedCategoryTab: action.category }
    default:
      return state
  }
}
