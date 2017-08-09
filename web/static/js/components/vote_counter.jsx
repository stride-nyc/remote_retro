import React from "react"
import * as AppPropTypes from "../prop_types"

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
    const { vote_count: voteCount } = this.props.idea

    return (
      <span>
        <div className="ui labeled right floated button">
          <button className="ui green button" onClick={this.handleClick}>
            Vote
          </button>
          <a className="ui basic green left pointing label">
            {voteCount}
          </a>
        </div>
      </span>
    )
  }
}

VoteCounter.propTypes = {
  retroChannel: AppPropTypes.retroChannel.isRequired,
  idea: AppPropTypes.idea.isRequired,
}

export default VoteCounter
