import React from "react"
import PropTypes from "prop-types"
import ReactTransitionGroup from "react-transition-group/CSSTransitionGroup"
import classNames from "classnames"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/vote_counter.css"
import STAGES from "../configs/stages"

const { VOTING } = STAGES

class VoteCounter extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const { idea, retroChannel, currentUser } = this.props
    retroChannel.push("submit_vote", { ideaId: idea.id, userId: currentUser.id })
  }

  render() {
    const { buttonDisabled, votes, idea, stage } = this.props
    const counterClasses = classNames("ui labeled right floated button", {
      disabled: buttonDisabled,
    })

    let voteCountForIdea
    if (stage === VOTING) {
      voteCountForIdea = votes.filter(vote =>
        vote.idea_id === idea.id && vote.user_id === this.props.currentUser.id
      ).length
    } else {
      voteCountForIdea = votes.filter(vote => vote.idea_id === idea.id).length
    }

    return (
      <div className={counterClasses}>
        <button
          className={`ui green button ${styles.voteButton}`}
          onClick={this.handleClick}
        >
          Vote
        </button>
        <a className={`ui basic green label ${styles.voteCount}`}>
          <ReactTransitionGroup
            component="div"
            transitionName="increment"
            transitionEnterTimeout={250}
            transitionLeaveTimeout={250}
          >
            <div key={voteCountForIdea}>{voteCountForIdea}</div>
          </ReactTransitionGroup>
        </a>
      </div>
    )
  }
}

VoteCounter.defaultProps = {
  buttonDisabled: false,
}

VoteCounter.propTypes = {
  retroChannel: AppPropTypes.retroChannel.isRequired,
  idea: AppPropTypes.idea.isRequired,
  votes: AppPropTypes.votes.isRequired,
  buttonDisabled: PropTypes.bool,
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
}

export default VoteCounter
