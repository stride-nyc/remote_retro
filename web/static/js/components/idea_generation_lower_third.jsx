import React from "react"

import IdeaSubmissionForm from "./idea_submission_form"
import LowerThirdWrapper from "./lower_third_wrapper"
import StageProgressionButton from "./stage_progression_button"
import stageConfigs from "../configs/stage_configs"

import * as AppPropTypes from "../prop_types"

const IdeaGenerationLowerThird = props => {
  const { stage, currentUser, ideas } = props

  const isFacilitator = currentUser.is_facilitator
  const stageConfig = stageConfigs[stage]
  const showActionItem = ["action-items", "action-item-distribution"].includes(stage)

  function wereActionItemsSubmitted() {
    return showActionItem && !ideas.some(idea => idea.category === "action-item")
  }

  return (
    <LowerThirdWrapper displayContents={stage !== "action-item-distribution"}>
      <div className="thirteen wide column">
        <IdeaSubmissionForm {...props} showActionItem={showActionItem} />
      </div>
      <div className="three wide right aligned column">
        { isFacilitator &&
          <StageProgressionButton
            {...props}
            config={stageConfig}
            buttonDisabled={wereActionItemsSubmitted()}
          />
        }
      </div>
    </LowerThirdWrapper>
  )
}

IdeaGenerationLowerThird.defaultProps = {
  currentUser: { is_facilitator: false },
}

IdeaGenerationLowerThird.propTypes = {
  currentUser: AppPropTypes.user,
  ideas: AppPropTypes.ideas.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: React.PropTypes.string.isRequired,
}

export default IdeaGenerationLowerThird
