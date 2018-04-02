/* eslint-disable react/jsx-filename-extension, global-require */

import React from "react"
import { render } from "react-dom"
import { bindActionCreators } from "redux"
import { Provider } from "react-redux"
import { AppContainer } from "react-hot-loader"

import RetroChannel from "./services/retro_channel"
import configureStore from "./configure_store"
import { actions } from "./redux"

const { userToken, retroUUID } = window

const store = configureStore()

const actionz = bindActionCreators({ ...actions }, store.dispatch)
const retroChannel = RetroChannel.configure({ userToken, retroUUID, store, actions: actionz })

retroChannel.join()
  .receive("error", error => console.error(error))
  .receive("ok", initialState => {
    actionz.setInitialState(initialState)

    const renderWithHotReload = () => {
      const RemoteRetro = require("./components/remote_retro").default

      render(
        <AppContainer>
          <Provider store={store}>
            <RemoteRetro retroChannel={retroChannel} userToken={userToken} />
          </Provider>
        </AppContainer>,
        document.querySelector(".react-root")
      )
    }

    // initial render
    renderWithHotReload()

    if (module.hot) {
      // ensure rerenders on module updates
      module.hot.accept(() => { renderWithHotReload() })
    }
  })
