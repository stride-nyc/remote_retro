import React from "react"
import PropTypes from "prop-types"

import IdeaSubmissionForm from "./idea_submission_form"
import StageProgressionButton from "./stage_progression_button"
import stageConfigs from "../configs/stage_configs"

import * as AppPropTypes from "../prop_types"

const IdeaGenerationLowerThirdContent = props => {
  const { stage, currentUser, ideas } = props

  const isFacilitator = currentUser.is_facilitator
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
        { isFacilitator &&
          <StageProgressionButton
            {...props}
            config={stageConfig}
            buttonDisabled={progressionDisabled()}
          />
        }
      </div>
    </div>
  )
}

IdeaGenerationLowerThirdContent.defaultProps = {
  currentUser: { is_facilitator: false },
}

IdeaGenerationLowerThirdContent.propTypes = {
  currentUser: AppPropTypes.user,
  ideas: AppPropTypes.ideas.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: PropTypes.string.isRequired,
}

export default IdeaGenerationLowerThirdContent
