import React from "react"

import ActionItemSubmissionForm from "./action_item_submission_form"
import StageProgressionButton from "./stage_progression_button"
import stageConfigs from "../configs/stage_configs"

import * as AppPropTypes from "../prop_types"

const ActionItemGenerationLowerThirdContent = props => {
  const { stage } = props
  const stageConfig = stageConfigs[stage]

  return (
    <div className="ui stackable grid basic attached secondary center aligned segment">
      <div className="thirteen wide column">
        <ActionItemSubmissionForm {...props} />
      </div>
      <div className="three wide right aligned column">
        <StageProgressionButton
          {...props}
          config={stageConfig}
        />
      </div>
    </div>
  )
}

ActionItemGenerationLowerThirdContent.propTypes = {
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: AppPropTypes.stage.isRequired,
}

export default ActionItemGenerationLowerThirdContent
