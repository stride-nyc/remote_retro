import React from "react"
import PropTypes from "prop-types"

import IdeaSubmissionForm from "./idea_submission_form"
import StageProgressionButton from "./stage_progression_button"

import * as AppPropTypes from "../prop_types"

const IdeaGenerationLowerThirdContent = props => {
  const { isAnActionItemsStage, stageConfig, ideas, currentUser } = props

  function progressionDisabled() {
    const noIdeasCreated = !isAnActionItemsStage && !ideas.length
    const noActionItemsCreated = isAnActionItemsStage && !ideas.some(idea => idea.category === "action-item")
    return noIdeasCreated || noActionItemsCreated
  }

  return (
    <div className="ui stackable grid basic attached secondary left aligned segment">
      <div className="thirteen wide column">
        <IdeaSubmissionForm
          currentUser={currentUser}
          ideas={ideas}
        />
      </div>
      <StageProgressionButton
        currentUser={currentUser}
        config={stageConfig.progressionButton}
        className="three wide right aligned column"
        buttonDisabled={progressionDisabled()}
      />
    </div>
  )
}

IdeaGenerationLowerThirdContent.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stageConfig: AppPropTypes.stageConfig.isRequired,
  isAnActionItemsStage: PropTypes.bool.isRequired,
}

export default IdeaGenerationLowerThirdContent
