import { createStore, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"
import { responsiveStoreEnhancer } from "redux-responsive"

import { reducer as rootReducer } from "./redux"
import interceptOverEagerReactReduxWarning from "./dev-utils/intercept_overeager_reactredux_warning"
import devStoreEnhancer from "./dev-utils/store_enhancer"

export default retroChannel => {
  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(thunk.withExtraArgument(retroChannel)),
      responsiveStoreEnhancer,
      devStoreEnhancer
    )
  )

  // ensures that updates to reducers are hot reloaded
  if (module.hot) {
    interceptOverEagerReactReduxWarning()

    module.hot.accept("./redux/index", async () => {
      const { reducer: nextRootReducer } = await import("./redux/index")
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
