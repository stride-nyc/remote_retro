import { combineReducers } from "redux"

import user from "./user"
import idea from "./idea"
import stage from "./stage"
import insertedAt from "./inserted_at"
import alertConfig from "./alert_config"

const rootReducer = combineReducers({
  user,
  idea,
  stage,
  insertedAt,
  alertConfig,
})

export default rootReducer
