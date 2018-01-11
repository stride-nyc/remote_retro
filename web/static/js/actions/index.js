import * as presenceActionCreators from "../actions/presence"
import * as ideaActionCreators from "../actions/idea"
import * as retroActionCreators from "../actions/retro"
import * as voteActionCreators from "../actions/vote"

export default {
  ...presenceActionCreators,
  ...ideaActionCreators,
  ...retroActionCreators,
  ...voteActionCreators,
}
