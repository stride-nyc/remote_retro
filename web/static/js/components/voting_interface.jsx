import React from "react"
import PropTypes from "prop-types"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import classNames from "classnames"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/voting_interface.css"

class VotingInterface extends React.Component {
  handleAddVoteClick = () => {
    const { actions, ideaToCastVoteFor, currentUser, currentUserHasExhaustedVotes } = this.props

    // we :disable the add vote button via this prop, but a bad actor
    // could remove the disabled attribute via dev tools
    if (currentUserHasExhaustedVotes) { return }

    actions.submitVote(ideaToCastVoteFor, currentUser)
  }

  handleSubtractVoteClick = () => {
    const { actions, votesForEntity, currentUser } = this.props
    const voteToRetract = votesForEntity.find(vote => vote.user_id === currentUser.id)
    actions.submitVoteRetraction(voteToRetract)
  }

  render() {
    const {
      votesForEntity,
      isVotingStage = false,
      currentUser,
      currentUserHasExhaustedVotes,
    } = this.props

    const userVoteCountForIdea = votesForEntity
      .filter(vote => vote.user_id === currentUser.id).length

    // voting is blind. totals revealed after stage progression.
    const displayableVoteCount = isVotingStage ? userVoteCountForIdea : votesForEntity.length

    const wrapperClasses = classNames("ui labeled button", styles.wrapper, {
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
              disabled={currentUserHasExhaustedVotes}
              className={`ui plus button ${styles.alterCountButton}`}
              onClick={this.handleAddVoteClick}
            >
              <i className="plus icon" />
            </button>
          </div>
        ) : (
          <div className={`ui basic button ${styles.votesLabel}`}>
            Votes
          </div>
        )}

        <div className={`ui basic label ${styles.voteCount}`}>
          <TransitionGroup>
            <CSSTransition
              in
              appear={false}
              key={displayableVoteCount}
              classNames="increment"
              timeout={250}
            >
              <div key={displayableVoteCount}>
                {displayableVoteCount}
              </div>
            </CSSTransition>
          </TransitionGroup>
        </div>

      </div>
    )
  }
}

VotingInterface.propTypes = {
  ideaToCastVoteFor: AppPropTypes.idea.isRequired,
  votesForEntity: AppPropTypes.votes.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  isVotingStage: PropTypes.bool.isRequired,
  currentUserHasExhaustedVotes: PropTypes.bool.isRequired,
  actions: AppPropTypes.actions.isRequired,
}

export default VotingInterface
