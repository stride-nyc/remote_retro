import React from "react"

import IdeaSubmissionForm from "./idea_submission_form"
import StageProgressionButton from "./stage_progression_button"

import * as AppPropTypes from "../prop_types"
import STAGES from "../configs/stages"

const { IDEA_GENERATION, ACTION_ITEMS } = STAGES

const IdeaGenerationLowerThirdContent = props => {
  const { stage, stageConfig, ideas, currentUser, retroChannel } = props

  function progressionDisabled() {
    const noIdeasCreated = stage === IDEA_GENERATION && !ideas.length
    const noActionItemsCreated = stage === ACTION_ITEMS && !ideas.some(idea => idea.category === "action-item")
    return noIdeasCreated || noActionItemsCreated
  }

  return (
    <div className="ui stackable grid basic attached secondary left aligned segment">
      <div className="thirteen wide column">
        <IdeaSubmissionForm
          stage={stage}
          currentUser={currentUser}
          ideas={ideas}
          retroChannel={retroChannel}
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
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: AppPropTypes.stage.isRequired,
  stageConfig: AppPropTypes.stageConfig.isRequired,
}

export default IdeaGenerationLowerThirdContent
