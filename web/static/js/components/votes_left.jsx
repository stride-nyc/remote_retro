import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"

import { voteMax } from "../configs/retro_configs"
import styles from "./css_modules/votes_left.css"
import { selectors } from "../redux"

import * as AppPropTypes from "../prop_types"

export const VotesLeft = props => {
  const { cumulativeVoteCountForUser } = props
  const votesLeft = cumulativeVoteCountForUser ? voteMax - cumulativeVoteCountForUser : voteMax
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
  cumulativeVoteCountForUser: PropTypes.number.isRequired,
}

const mapStateToProps = (state, { currentUser }) => {
  return {
    cumulativeVoteCountForUser: selectors.cumulativeVoteCountForUser(state, currentUser),
  }
}

export default connect(
  mapStateToProps
)(VotesLeft)
