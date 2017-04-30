import React, { Component } from "react"
import * as AppPropTypes from "../prop_types"

class StageProgressionButton extends Component {
  constructor(props) {
    super(props)
    this.handleStageProgression = this.handleStageProgression.bind(this)
  }

  handleStageProgression() {
    const { stage, retroChannel, stageProgressionConfigs } = this.props
    const stageConfig = stageProgressionConfigs[stage]
    const noConfirmationNecessary = !stageConfig.confirmationMessage

    if (noConfirmationNecessary || confirm(stageConfig.confirmationMessage)) {
      retroChannel.push("proceed_to_next_stage", { stage: stageConfig.nextStage })
    }
  }

  render() {
    const { stage, stageProgressionConfigs } = this.props
    const { buttonConfig } = stageProgressionConfigs[stage]
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
  stageProgressionConfigs: React.PropTypes.object.isRequired,
}

export default StageProgressionButton
