import React, { PropTypes } from "react"
import classNames from "classnames"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/vote_counter.css"

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
    const { buttonDisabled } = this.props
    const { vote_count: voteCount } = this.props.idea
    const counterClasses = classNames("ui labeled right floated button", {
      disabled: buttonDisabled,
    })

    return (
      <div className={counterClasses}>
        <button
          className={`ui green button ${styles.voteButton}`}
          onClick={this.handleClick}
          disabled={buttonDisabled}
        >
          Vote
        </button>
        <a className={`ui basic green label ${styles.voteCount}`}>
          {voteCount}
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
  buttonDisabled: PropTypes.bool,
  currentUser: AppPropTypes.user.isRequired,
}

export default VoteCounter
