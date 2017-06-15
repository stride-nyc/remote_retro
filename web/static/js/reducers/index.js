import { combineReducers } from "redux"

import user from "./user"
import idea from "./idea"

const rootReducer = combineReducers({
  user,
  idea,
})

export default rootReducer
