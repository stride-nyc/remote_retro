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
  const { userToken, retroUUID } = window

  const retroChannel = new RetroChannel({ userToken, retroUUID })
  const store = configureStore(retroChannel)

  const actionz = bindActionCreators({ ...actions }, store.dispatch)

  retroChannel.applyListenersWithDispatch(store, actionz)

  console.time('retroChannelJoin -> recieved "ok"')
  retroChannel.join()
    .receive("error", error => console.error(error))
    .receive("ok", initialState => {
      console.timeEnd('retroChannelJoin -> recieved "ok"')
      actionz.setInitialState(initialState)

      console.time('joined -> presences found and app mounted')
      awaitPresencesBeforeMountingApp()
    })

  const awaitPresencesBeforeMountingApp = () => {
    const interval = setInterval(() => {
      const { presences } = store.getState()

      if (!presences.length) { return }

      console.timeEnd('joined -> presences found and app mounted')
      renderWithHotReload()
      clearInterval(interval)

      if (module.hot) {
        module.hot.accept(() => { renderWithHotReload() })
      }
    }, 1)
  }

  const dragAndDropContext = DragDropContext(MultiBackend(HTML5toTouch))
  const renderWithHotReload = () => {
    const RemoteRetro = dragAndDropContext(
      require("./components/remote_retro").default
    )

    const postRenderCallback = () => {
      document.removeEventListener('visibilitychange', window.__trackLoadAbandonment)
    }

    render(
      <AppContainer>
        <Provider store={store}>
          <RemoteRetro />
        </Provider>
      </AppContainer>,
      document.querySelector(".react-root"),
      postRenderCallback,
    )
  }
})
