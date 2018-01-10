import React from "react"
import { connect } from "react-redux"

import { voteMax } from "../configs/retro_configs"
import styles from "./css_modules/votes_left.css"

import * as AppPropTypes from "../prop_types"

export const VotesLeft = props => {
  const { currentUser, votes } = props
  const userVoteCount = votes.filter(vote => vote.user_id === currentUser.id).length
  const votesLeft = userVoteCount ? voteMax - userVoteCount : voteMax
  const votesText = votesLeft === 1 ? "Vote Left" : "Votes Left"

  return (
    <div className={`${styles.index} ui row`}>
      <h2 className="ui header">
        {votesLeft}
        <div className="sub header">{votesText}</div>
      </h2>
    </div>
  )
}

VotesLeft.propTypes = {
  currentUser: AppPropTypes.presence.isRequired,
  votes: AppPropTypes.votes.isRequired,
}

const mapStateToProps = ({ votes }) => ({ votes })

export default connect(
  mapStateToProps
)(VotesLeft)
