import * as userActionCreators from "../actions/user"
import * as ideaActionCreators from "../actions/idea"
import * as retroActionCreators from "../actions/retro"
import updateVoteCounter from "../actions/user_vote_counter"

export default {
  ...userActionCreators,
  ...ideaActionCreators,
  ...retroActionCreators,
  updateVoteCounter,
}
