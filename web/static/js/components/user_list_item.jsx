import React from "react"
import { connect } from "react-redux"
import { voteMax } from "../configs/retro_configs"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/user_list_item.css"
import AnimatedEllipsis from "./animated_ellipsis"
import STAGES from "../configs/stages"

const { VOTING } = STAGES

export const UserListItem = ({ user, votes, stage }) => {
  const imgSrc = user.picture.replace("sz=50", "sz=200")
  const votesByUser = votes.filter(vote => vote.user_id === user.id).length
  const allVotesIn = votesByUser >= voteMax

  let identifier = user.given_name
  if (user.is_facilitator) {
    identifier += " (Facilitator)"
  }

  return (
    <li className={`item ${styles.wrapper}`}>
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
  user: AppPropTypes.presence.isRequired,
  votes: AppPropTypes.votes.isRequired,
  stage: AppPropTypes.stage.isRequired,
}

const mapStateToProps = ({ votes, retro }) => ({
  votes,
  stage: retro.stage,
})

export default connect(
  mapStateToProps
)(UserListItem)
