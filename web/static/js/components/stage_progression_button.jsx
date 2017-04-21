import React, { Component } from "react"
import * as AppPropTypes from "../prop_types"

const stageConfigurationMap = {
  "idea-generation": {
    confirmationMessage: "Are you sure you would like to proceed to the action items stage?",
    nextStage: "action-items",
    buttonConfig: {
      copy: "Proceed to Action Items",
      iconClass: "arrow right",
    },
  },
  "action-items": {
    confirmationMessage: null,
    nextStage: "action-item-distribution",
    buttonConfig: {
      copy: "Send Action Items",
      iconClass: "send",
    },
  },
}

class StageProgressionButton extends Component {
  constructor(props) {
    super(props)
    this.handleStageProgression = this.handleStageProgression.bind(this)
  }

  handleStageProgression() {
    const stageConfig = stageConfigurationMap[this.props.stage]
    const noConfirmationNecessary = !stageConfig.confirmationMessage

    if (noConfirmationNecessary || confirm(stageConfig.confirmationMessage)) {
      this.props.retroChannel.push("proceed_to_next_stage", { stage: stageConfig.nextStage })
    }
  }

  render() {
    const { buttonConfig } = stageConfigurationMap[this.props.stage]
    return (
      <button
        className="fluid ui right labeled teal icon button"
        onClick={this.handleStageProgression}
      >
        { buttonConfig.copy }
        <i className={`${buttonConfig.iconClass} icon`} />
      </button>
    )
  }
}

StageProgressionButton.propTypes = {
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: React.PropTypes.string.isRequired,
}

export default StageProgressionButton
