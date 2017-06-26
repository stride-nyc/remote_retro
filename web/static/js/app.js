/* eslint-disable react/jsx-filename-extension */

import React from "react"
import { render } from "react-dom"
import { createStore } from "redux"
import { Provider } from "react-redux"

import RemoteRetro from "./components/remote_retro"
import RetroChannel from "./services/retro_channel"
import rootReducer from "./reducers"

const { userToken, retroUUID } = window

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const retroChannel = RetroChannel.configure({ userToken, retroUUID, store })

render(
  <Provider store={store}>
    <RemoteRetro retroChannel={retroChannel} userToken={userToken} />
  </Provider>,
  document.querySelector(".react-root")
)
