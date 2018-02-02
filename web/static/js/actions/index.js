import { actions as presenceActionCreators } from "../redux/presences"
import { actions as ideaActionCreators } from "../redux/ideas"
import { actions as retroActionCreators } from "../redux/retro"
import * as voteActionCreators from "../actions/vote"
import { actions as alertActionCreators } from "../redux/alert"

export default {
  ...alertActionCreators,
  ...presenceActionCreators,
  ...ideaActionCreators,
  ...retroActionCreators,
  ...voteActionCreators,
}
