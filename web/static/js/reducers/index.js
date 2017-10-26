import { combineReducers } from "redux"

import users from "./users"
import ideas from "./ideas"
import votes from "./votes"
import stage from "./stage"
import insertedAt from "./inserted_at"
import alert from "./alert"

const rootReducer = combineReducers({
  users,
  ideas,
  votes,
  stage,
  insertedAt,
  alert,
})

export default rootReducer
