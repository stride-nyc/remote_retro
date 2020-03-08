import React from "react"
import PropTypes from "prop-types"

import IdeaSubmissionForm from "./idea_submission_form"
import StageProgressionButton from "./stage_progression_button"

import * as AppPropTypes from "../prop_types"
import { IDEA_GENERATION_IDEA_COUNT_LIMIT } from "../configs/retro_configs"

const IdeaSubmissionLowerThirdContent = props => {
  const { isAnActionItemsStage, stageConfig, ideas, currentUser } = props
  const isIdeaGenerationStage = !isAnActionItemsStage
  const isAtIdeaGenerationIdeaCountLimit = isIdeaGenerationStage
    && ideas.length === IDEA_GENERATION_IDEA_COUNT_LIMIT

  function progressionDisabled() {
    const noIdeasGenerated = isIdeaGenerationStage && !ideas.length
    const noActionItemsCreated = isAnActionItemsStage && !ideas.some(idea => idea.category === "action-item")
    return noIdeasGenerated || noActionItemsCreated
  }

  return (
    <div className="ui stackable grid basic attached secondary left aligned segment">
      <div className="thirteen wide column">
        {isAtIdeaGenerationIdeaCountLimit ? (
          <h3 className="ui header">
            <i className="exclamation triangle icon" />
            <div className="content">
              Idea Limit Reached!
              <p className="sub header">Delete explicit duplicates if additional ideas need be added.</p>
            </div>
          </h3>
        ) : (
          <IdeaSubmissionForm
            currentUser={currentUser}
            ideas={ideas}
          />
        )}
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

IdeaSubmissionLowerThirdContent.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stageConfig: AppPropTypes.stageConfig.isRequired,
  isAnActionItemsStage: PropTypes.bool.isRequired,
}

export default IdeaSubmissionLowerThirdContent
