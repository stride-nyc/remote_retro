import { combineReducers } from "redux"

import users from "./users"
import usersById from "./users_by_id"
import ideas from "./ideas"
import votes from "./votes"
import stage from "./stage"
import insertedAt from "./inserted_at"
import alert from "./alert"

const rootReducer = combineReducers({
  users,
  usersById,
  ideas,
  votes,
  stage,
  insertedAt,
  alert,
})

export default rootReducer
