// IMPORTANT: this module is on the chopping block, and will be killed once
// the new interface is feature complete and we remove the 'subtractVoteDev' feature flag
// As such, any new work on the voting interface belongs in VotingInterfaceNew
import React from "react"
import PropTypes from "prop-types"
import ReactTransitionGroup from "react-transition-group/CSSTransitionGroup"
import classNames from "classnames"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/voting_interface_old.css"

class VotingInterfaceOld extends React.Component {
  handleAddVoteClick = () => {
    const { actions, idea, currentUser } = this.props
    actions.submitVote(idea, currentUser)
  }

  render() {
    const {
      votesForIdea,
      currentUser,
      buttonDisabled,
      isVotingStage,
    } = this.props

    const counterClasses = classNames("ui labeled right floated button", {
      disabled: buttonDisabled,
    })

    const userVoteCountForIdea = votesForIdea.filter(vote => vote.user_id === currentUser.id).length

    // voting is blind. totals revealed after stage progression.
    const displayableVoteCount = isVotingStage ? userVoteCountForIdea : votesForIdea.length

    return (
      <div className={counterClasses}>
        <button
          type="submit"
          className={`ui green button ${styles.voteButton}`}
          onClick={this.handleAddVoteClick}
          disabled={buttonDisabled}
        >
          Vote
        </button>

        <div className={`ui basic green label ${styles.voteCount}`}>
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

VotingInterfaceOld.defaultProps = {
  buttonDisabled: false,
  isVotingStage: false,
}

VotingInterfaceOld.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  votesForIdea: AppPropTypes.votes.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  buttonDisabled: PropTypes.bool,
  isVotingStage: PropTypes.bool,
  actions: AppPropTypes.actions.isRequired,
}

export default VotingInterfaceOld
