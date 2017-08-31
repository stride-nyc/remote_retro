import { combineReducers } from "redux"

import users from "./users"
import ideas from "./ideas"
import stage from "./stage"
import insertedAt from "./inserted_at"
import alert from "./alert"

const rootReducer = combineReducers({
  users,
  ideas,
  stage,
  insertedAt,
  alert,
})

export default rootReducer
