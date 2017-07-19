export const initialState = {
  submitIdeaPromptPointerVisible: true,
}

const ui = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_SUBMIT_IDEA_PROMPT_POINTER":
      return { ...state, submitIdeaPromptPointerVisible: action.value }
    default:
      return state
  }
}

export default ui
