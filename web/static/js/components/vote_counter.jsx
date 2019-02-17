import React from "react"
import PropTypes from "prop-types"
import ReactTransitionGroup from "react-transition-group/CSSTransitionGroup"
import classNames from "classnames"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/vote_counter.css"
import STAGES from "../configs/stages"

const { VOTING } = STAGES

class VoteCounter extends React.Component {
  handleClick = () => {
    const { actions, idea, currentUser } = this.props
    actions.submitVote(idea, currentUser)
  }

  render() {
    const { buttonDisabled, votes, idea, stage, currentUser } = this.props
    const counterClasses = classNames("ui labeled right floated button", {
      disabled: buttonDisabled,
    })

    let voteCountForIdea
    if (stage === VOTING) {
      voteCountForIdea = votes.filter(vote => {
        return vote.idea_id === idea.id && vote.user_id === currentUser.id
      }).length
    } else {
      voteCountForIdea = votes.filter(vote => vote.idea_id === idea.id).length
    }

    return (
      <div className={counterClasses}>
        <button
          className={`ui green button ${styles.voteButton}`}
          onClick={this.handleClick}
          disabled={buttonDisabled}
          type="submit"
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
            <div key={voteCountForIdea}>{voteCountForIdea}</div>
          </ReactTransitionGroup>
        </div>
      </div>
    )
  }
}

VoteCounter.defaultProps = {
  buttonDisabled: false,
}

VoteCounter.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  votes: AppPropTypes.votes.isRequired,
  buttonDisabled: PropTypes.bool,
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
  actions: AppPropTypes.actions.isRequired,
}

export default VoteCounter
