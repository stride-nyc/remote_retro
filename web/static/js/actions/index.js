import * as userActionCreators from "../actions/user"
import * as ideaActionCreators from "../actions/idea"
import * as retroActionCreators from "../actions/retro"

export default {
  ...userActionCreators,
  ...ideaActionCreators,
  ...retroActionCreators,
}
