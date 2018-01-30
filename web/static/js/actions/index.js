import * as presenceActionCreators from "../actions/presence"
import * as ideaActionCreators from "../actions/idea"
import * as retroActionCreators from "../actions/retro"
import * as voteActionCreators from "../actions/vote"
import { actions as alertActionCreators } from "../redux/alert"

export default {
  ...alertActionCreators,
  ...presenceActionCreators,
  ...ideaActionCreators,
  ...retroActionCreators,
  ...voteActionCreators,
}
