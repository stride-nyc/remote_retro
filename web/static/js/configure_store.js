/* eslint-disable global-require */
import { createStore, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"

import { reducer as rootReducer } from "./redux"
import interceptOverEagerReactReduxWarning from "./dev-utils/intercept_overeager_reactredux_warning"
import storeEnhancer from "./dev-utils/store_enhancer"

export default retroChannel => {
  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(thunk.withExtraArgument(retroChannel)),
      storeEnhancer
    )
  )

  // ensures that updates to reducers are hot reloaded
  if (module.hot) {
    interceptOverEagerReactReduxWarning()

    module.hot.accept("./redux/index", () => {
      const nextRootReducer = require("./redux/index").reducer
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
