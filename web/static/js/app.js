/* eslint-disable react/jsx-filename-extension, global-require */

// IE 11 support
import "core-js/features/set"
import "core-js/features/map"
import "core-js/features/symbol"
import "core-js/features/array"

import React from "react"
import { render } from "react-dom"
import { bindActionCreators } from "redux"
import { Provider } from "react-redux"
import { AppContainer } from "react-hot-loader"

import MultiBackend from "react-dnd-multi-backend"
import HTML5toTouch from "react-dnd-multi-backend/lib/HTML5toTouch"
import { DragDropContext } from "react-dnd"

import RetroChannel from "./services/retro_channel"
import configureStore from "./configure_store"
import { actions } from "./redux"

document.addEventListener('DOMContentLoaded', function() {
  const dragAndDropContext = DragDropContext(MultiBackend(HTML5toTouch))

  const { userToken, retroUUID } = window

  const retroChannel = new RetroChannel({ userToken, retroUUID })
  const store = configureStore(retroChannel)

  const actionz = bindActionCreators({ ...actions }, store.dispatch)

  retroChannel.applyListenersWithDispatch(store, actionz)

  retroChannel.join()
    .receive("error", error => console.error(error))
    .receive("ok", initialState => {
      actionz.setInitialState(initialState)

      awaitPresencesBeforeMountingApp()
    })

  const awaitPresencesBeforeMountingApp = () => {
    const interval = setInterval(() => {
      const { presences } = store.getState()

      if (!presences.length) { return }

      renderWithHotReload()
      clearInterval(interval)

      if (module.hot) {
        module.hot.accept(() => { renderWithHotReload() })
      }
    }, 2)
  }

  const renderWithHotReload = () => {
    const RemoteRetro = dragAndDropContext(
      require("./components/remote_retro").default
    )

    render(
      <AppContainer>
        <Provider store={store}>
          <RemoteRetro />
        </Provider>
      </AppContainer>,
      document.querySelector(".react-root")
    )
  }
})
