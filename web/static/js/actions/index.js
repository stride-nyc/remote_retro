import { actions as presenceActionCreators } from "../redux/presences"
import { actions as ideaActionCreators } from "../redux/ideas"
import { actions as retroActionCreators } from "../redux/retro"
import { actions as voteActionCreators } from "../redux/votes"
import { actions as alertActionCreators } from "../redux/alert"

export default {
  ...alertActionCreators,
  ...presenceActionCreators,
  ...ideaActionCreators,
  ...retroActionCreators,
  ...voteActionCreators,
}
