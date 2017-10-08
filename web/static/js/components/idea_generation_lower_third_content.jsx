import React from "react"

import IdeaSubmissionForm from "./idea_submission_form"
import StageProgressionButton from "./stage_progression_button"
import stageConfigs from "../configs/stage_configs"

import * as AppPropTypes from "../prop_types"

const IdeaGenerationLowerThirdContent = props => {
  const { stage, ideas } = props

  const stageConfig = stageConfigs[stage]
  const showActionItem = ["action-items", "closed"].includes(stage)

  function progressionDisabled() {
    const noIdeasCreated = stage === "idea-generation" && !ideas.length
    const noActionItemsCreated = stage === "action-items" && !ideas.some(idea => idea.category === "action-item")
    return noIdeasCreated || noActionItemsCreated
  }

  return (
    <div className="ui stackable grid basic attached secondary center aligned segment">
      <div className="thirteen wide column">
        <IdeaSubmissionForm {...props} showActionItem={showActionItem} />
      </div>
      <div className="three wide right aligned column">
        <StageProgressionButton
          {...props}
          config={stageConfig}
          buttonDisabled={progressionDisabled()}
        />
      </div>
    </div>
  )
}

IdeaGenerationLowerThirdContent.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: AppPropTypes.stage.isRequired,
}

export default IdeaGenerationLowerThirdContent
