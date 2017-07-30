import { combineReducers } from "redux"

import user from "./user"
import idea from "./idea"
import stage from "./stage"
import insertedAt from "./inserted_at"
import alert from "./alert"

const rootReducer = combineReducers({
  user,
  idea,
  stage,
  insertedAt,
  alert,
})

export default rootReducer
