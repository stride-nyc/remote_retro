import React from "react"

import { voteMax } from "../configs/retro_configs"

import * as AppPropTypes from "../prop_types"

const VotesLeft = props => {
  const { currentUser } = props
  const userVoteCount = currentUser.vote_count
  const votesLeft = userVoteCount ? voteMax - userVoteCount : voteMax
  const votesText = votesLeft === 1 ? "Vote Left" : "Votes Left"

  return (
    <div className="sixteen wide column">
      <h2 className="ui header">
        {votesLeft}
        <div className="sub header">{votesText}</div>
      </h2>
    </div>
  )
}

VotesLeft.propTypes = {
  currentUser: AppPropTypes.user.isRequired,
}

export default VotesLeft
