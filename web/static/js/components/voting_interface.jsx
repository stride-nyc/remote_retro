import React from "react"
import PropTypes from "prop-types"
import ReactTransitionGroup from "react-transition-group/CSSTransitionGroup"
import classNames from "classnames"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/voting_interface.css"

class VotingInterface extends React.Component {
  handleAddVoteClick = () => {
    const { actions, idea, currentUser, userHasExhaustedVotes } = this.props

    // we :disable the add vote button via this prop, but a bad actor
    // could remove the disabled attribute via dev tools
    if (userHasExhaustedVotes) { return }

    actions.submitVote(idea, currentUser)
  }

  handleSubtractVoteClick = () => {
    const { actions, votesForIdea, currentUser } = this.props
    const voteToRetract = votesForIdea.find(vote => vote.user_id === currentUser.id)
    actions.submitVoteRetraction(voteToRetract)
  }

  render() {
    const {
      votesForIdea,
      isVotingStage,
      currentUser,
      userHasExhaustedVotes,
    } = this.props

    const userVoteCountForIdea = votesForIdea.filter(vote => vote.user_id === currentUser.id).length

    // voting is blind. totals revealed after stage progression.
    const displayableVoteCount = isVotingStage ? userVoteCountForIdea : votesForIdea.length

    const wrapperClasses = classNames("ui labeled right floated button", styles.wrapper, {
      static: !isVotingStage,
    })

    return (
      <div className={wrapperClasses}>
        {isVotingStage ? (
          <div className={`ui tiny basic icon buttons ${styles.alterCountButtonGroup}`}>
            <button
              type="submit"
              disabled={userVoteCountForIdea === 0}
              className={`ui minus button ${styles.alterCountButton}`}
              onClick={this.handleSubtractVoteClick}
            >
              <i className="minus icon" />
            </button>
            <button
              type="submit"
              disabled={userHasExhaustedVotes}
              className={`ui plus button ${styles.alterCountButton}`}
              onClick={this.handleAddVoteClick}
            >
              <i className="plus icon" />
            </button>
          </div>
        ) : (
          <div className={`ui basic button ${styles.voteButton}`}>
            Votes
          </div>
        )}

        <div className={`ui basic label ${styles.voteCount}`}>
          <ReactTransitionGroup
            component="div"
            transitionName="increment"
            transitionEnterTimeout={250}
            transitionLeaveTimeout={250}
          >
            <div key={displayableVoteCount}>{displayableVoteCount}</div>
          </ReactTransitionGroup>
        </div>

      </div>
    )
  }
}

VotingInterface.defaultProps = {
  isVotingStage: false,
  userHasExhaustedVotes: false,
}

VotingInterface.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  votesForIdea: AppPropTypes.votes.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  isVotingStage: PropTypes.bool,
  userHasExhaustedVotes: PropTypes.bool,
  actions: AppPropTypes.actions.isRequired,
}

export default VotingInterface
