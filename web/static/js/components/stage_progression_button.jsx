import React, { Component } from "react"
import * as AppPropTypes from "../prop_types"

class StageProgressionButton extends Component {
  constructor(props) {
    super(props)
    this.handleStageProgression = this.handleStageProgression.bind(this)
  }

  handleStageProgression() {
    if (confirm("Are you sure you would like to proceed to the action items stage?")) {
      this.props.retroChannel.push("show_action_item", { show_action_item: true })
    }
  }

  render() {
    return (
      <button
        className="fluid ui right labeled teal icon button"
        onClick={this.handleStageProgression}
      >
        Proceed to Action Items
        <i className="arrow right icon" />
      </button>
    )
  }
}

StageProgressionButton.propTypes = {
  retroChannel: AppPropTypes.retroChannel.isRequired,
}

export default StageProgressionButton
