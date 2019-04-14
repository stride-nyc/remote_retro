import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { selectors, actions } from "../redux"
import { VOTE_LIMIT } from "../configs/retro_configs"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/user_list_item.css"
import AnimatedEllipsis from "./animated_ellipsis"
import STAGES from "../configs/stages"

const { VOTING } = STAGES

export const UserListItem = ({ user, votes, stage, currentUser, actions }) => {
  const imgSrc = user.picture.replace("sz=50", "sz=200")
  const votesByUser = votes.filter(vote => vote.user_id === user.id).length
  const allVotesIn = votesByUser >= VOTE_LIMIT
  const renderFacilitatorTransferButton = !user.is_facilitator && currentUser.is_facilitator

  let identifier = user.given_name
  if (user.is_facilitator) {
    identifier += " (Facilitator)"
  }

  function passFacilitatorshipTo(user) {
    if (window.confirm(`Are you want sure you want to pass the facilitatorship to ${user.given_name}?`)) {
      actions.updateRetroAsync({ facilitator_id: user.id })
    }
  }

  return (
    <li className={`item ${styles.wrapper}`}>
      {renderFacilitatorTransferButton && (
        <button
          type="button"
          title={`Transfer facilitatorship to ${user.given_name}`}
          className={styles.facilitator}
          onClick={() => passFacilitatorshipTo(user)}
        >
          <i className="ui circular magic icon" />
        </button>
      )}
      <img className={styles.picture} src={imgSrc} alt={identifier} />
      <p data-hj-masked>{identifier}</p>
      { stage !== VOTING && <AnimatedEllipsis animated={user.is_typing} /> }
      { stage === VOTING && (
        <span className={`${styles.allVotesIn} ${allVotesIn ? "opaque" : ""}`}>ALL VOTES IN</span>
      )}
    </li>
  )
}

UserListItem.propTypes = {
  currentUser: AppPropTypes.presence.isRequired,
  user: AppPropTypes.presence.isRequired,
  votes: AppPropTypes.votes.isRequired,
  stage: AppPropTypes.stage.isRequired,
  actions: AppPropTypes.actions.isRequired,
}

const mapStateToProps = state => ({
  votes: state.votes,
  stage: state.retro.stage,
  currentUser: selectors.getCurrentUserPresence(state),
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserListItem)
