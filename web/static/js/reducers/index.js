import { combineReducers } from "redux"

import presences from "./presences"
import usersById from "./users_by_id"
import { reducer as ideas } from "../redux/ideas"
import votes from "./votes"
import stage from "./stage"
import insertedAt from "./inserted_at"
import { reducer as alert } from "../redux/alert"

const rootReducer = combineReducers({
  presences,
  usersById,
  ideas,
  votes,
  stage,
  insertedAt,
  alert,
})

export default rootReducer
