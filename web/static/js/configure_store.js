/* eslint-disable global-require */
import { createStore } from "redux"

import rootReducer from "./reducers"
import interceptOverEagerReactReduxWarning from "./dev-utils/intercept_overeager_reactredux_warning"

const isProd = location.host === "remoteretro.org"

export default () => {
  const store = createStore(
    rootReducer,
    !isProd && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )

  // ensures that updates to reducers are hot reloaded
  if (module.hot) {
    interceptOverEagerReactReduxWarning()

    module.hot.accept("./reducers/index", () => {
      const nextRootReducer = require("./reducers/index").default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
