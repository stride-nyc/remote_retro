import { combineReducers } from "redux"

import users from "./users"
import ideas from "./ideas"
import stage from "./stage"
import insertedAt from "./inserted_at"
import alert from "./alert"
import userVoteCounter from "./user_vote_counter"

const rootReducer = combineReducers({
  users,
  ideas,
  stage,
  insertedAt,
  alert,
  userVoteCounter,
})

export default rootReducer
