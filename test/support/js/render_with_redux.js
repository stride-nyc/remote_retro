import React from "react"
import { render } from "@testing-library/react"
import { Provider } from "react-redux"
import { createStore } from "redux"

// Create a mock store for testing
const createMockStore = (initialState = {}) => {
  return createStore(() => ({
    retro: {
      facilitator_id: 1,
      stage: "idea-generation",
    },
    ideas: [],
    votes: [],
    usersById: {},
    presences: [],
    ...initialState,
  }))
}

// Wrapper component to provide Redux store
const renderWithRedux = (ui, initialState) => {
  const store = createMockStore(initialState)
  return render(
    <Provider store={store}>
      {ui}
    </Provider>
  )
}

export default renderWithRedux
