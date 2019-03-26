import React from "react"
import { connect } from "react-redux"
import { selectors } from "../redux"
import { VOTE_LIMIT } from "../configs/retro_configs"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/user_list_item.css"
import AnimatedEllipsis from "./animated_ellipsis"
import STAGES from "../configs/stages"

const { VOTING } = STAGES

export const UserListItem = ({ user, votes, stage, currentUser }) => {
  const imgSrc = user.picture.replace("sz=50", "sz=200")
  const votesByUser = votes.filter(vote => vote.user_id === user.id).length
  const allVotesIn = votesByUser >= VOTE_LIMIT
  const renderFacilitatorTransferButton = !user.is_facilitator && currentUser.is_facilitator

  let identifier = user.given_name
  if (user.is_facilitator) {
    identifier += " (Facilitator)"
  }

  function passFacilitator() {
    console.log("foobar")
  }

  return (
    <li className={`item ${styles.wrapper}`}>
      {renderFacilitatorTransferButton
      && (
        <button
          type="button"
          data-tooltip="Transfer facilitatorship"
          data-inverted=""
          data-position="bottom right"
          className={`${styles.facilitator}`}
          onClick={passFacilitator}
        >
          {currentUser.id !== user.id && <i className="ui magic icon" />}
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
}

const mapStateToProps = state => ({
  votes: state.votes,
  stage: state.retro.stage,
  currentUser: selectors.getCurrentUserPresence(state),
})

export default connect(
  mapStateToProps
)(UserListItem)
