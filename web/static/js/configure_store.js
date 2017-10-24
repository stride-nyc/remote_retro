/* eslint-disable global-require */
import { createStore } from "redux"

import rootReducer from "./reducers"
import interceptOverEagerReactReduxWarning from "./dev-utils/intercept_overeager_reactredux_warning"

export default () => {
  const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && module.hot && window.__REDUX_DEVTOOLS_EXTENSION__()
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
