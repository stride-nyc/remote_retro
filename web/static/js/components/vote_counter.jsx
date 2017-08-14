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
    const { idea, retroChannel } = this.props
    retroChannel.push("submit_vote", { id: idea.id })
  }

  render() {
    const { buttonDisabled } = this.props
    const buttonClasses = classNames(`ui button ${styles.voteButton}`, {
      green: !buttonDisabled,
      grey: buttonDisabled,
      [`${styles.disabledButton}`]: buttonDisabled,
    })
    const labelClasses = classNames(`ui basic left pointing label ${styles.voteCount}`, {
      green: !buttonDisabled,
      grey: buttonDisabled,
    })
    const buttonWrapperClasses = classNames("ui labeled right floated button", {
      [`${styles.disabledButton}`]: buttonDisabled,
    })
    const { vote_count: voteCount } = this.props.idea

    return (
      <div className={buttonWrapperClasses}>
        <button
          className={buttonClasses}
          onClick={this.handleClick}
          disabled={buttonDisabled}
        >
          Vote
        </button>
        <a className={labelClasses}>
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
}

export default VoteCounter
