import { combineReducers } from "redux"

import user from "./user"
import idea from "./idea"
import stage from "./stage"

const rootReducer = combineReducers({
  user,
  idea,
  stage,
})

export default rootReducer
