/* eslint-disable react/jsx-filename-extension, global-require */

// IE 11 support
import "core-js/features/set"
import "core-js/features/map"
import "core-js/features/symbol"
import "core-js/features/array"

import React from "react"
import { createRoot } from "react-dom/client"
import { bindActionCreators } from "redux"
import { Provider } from "react-redux"
import { HelmetProvider } from "react-helmet-async"

import MultiBackend from "react-dnd-multi-backend"
import HTML5toTouch from "react-dnd-multi-backend/lib/HTML5toTouch"
import { DragDropContext } from "react-dnd"

import RetroChannel from "./services/retro_channel"
import configureStore from "./configure_store"
import { actions } from "./redux"

document.addEventListener("DOMContentLoaded", () => {
  const { userToken, retroUUID } = window

  const retroChannel = new RetroChannel({ userToken, retroUUID })
  const store = configureStore(retroChannel)

  const actionz = bindActionCreators({ ...actions }, store.dispatch)

  retroChannel.applyListenersWithDispatch(store, actionz)

  console.time("retroChannelJoin -> recieved \"ok\"")
  retroChannel.join()
    .receive("error", error => console.error(error))
    .receive("ok", initialState => {
      console.timeEnd("retroChannelJoin -> recieved \"ok\"")
      actionz.setInitialState(initialState)

      console.time("joined -> presences found and app mounted")
      const interval = setInterval(() => {
        const { presences } = store.getState()

        if (!presences.length) { return }

        console.timeEnd("joined -> presences found and app mounted")
        clearInterval(interval)

        const dragAndDropContext = DragDropContext(MultiBackend(HTML5toTouch))
        const RemoteRetro = dragAndDropContext(require("./components/remote_retro").default)

        const root = createRoot(document.querySelector(".react-root"))
        root.render(
          <HelmetProvider>
            <Provider store={store}>
              <RemoteRetro />
            </Provider>
          </HelmetProvider>
        )

        document.removeEventListener("visibilitychange", window.__trackLoadAbandonment)
      }, 1)
    })
})
