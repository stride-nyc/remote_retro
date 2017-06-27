/* eslint-disable react/jsx-filename-extension */

import React from "react"
import { render } from "react-dom"
import { createStore, bindActionCreators } from "redux"
import { Provider } from "react-redux"

import RemoteRetro from "./components/remote_retro"
import RetroChannel from "./services/retro_channel"
import rootReducer from "./reducers"
import actions from "./actions"

const { userToken, retroUUID } = window

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const actionz = bindActionCreators({ ...actions }, store.dispatch)
const retroChannel = RetroChannel.configure({ userToken, retroUUID, store, actions: actionz })

retroChannel.join()
  .receive("error", error => console.error(error))
  .receive("ok", initialState => {
    actionz.setInitialState(initialState)

    render(
      <Provider store={store}>
        <RemoteRetro retroChannel={retroChannel} userToken={userToken} />
      </Provider>,
      document.querySelector(".react-root")
    )
  })
