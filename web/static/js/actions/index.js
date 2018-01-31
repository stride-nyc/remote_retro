import * as presenceActionCreators from "../actions/presence"
import { actions as ideaActionCreators } from "../redux/ideas"
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
