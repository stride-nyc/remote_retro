import React from "react"
import PropTypes from "prop-types"

import IdeaSubmissionForm from "./idea_submission_form"
import VotesLeft from "./votes_left"
import LowerThirdWrapper from "./lower_third_wrapper"
import StageProgressionButton from "./stage_progression_button"
import stageConfigs from "../configs/stage_configs"

import * as AppPropTypes from "../prop_types"

const LowerThird = props => {
  const { stage, currentUser, ideas } = props

  const isFacilitator = currentUser.is_facilitator
  const stageConfig = stageConfigs[stage]
  const showActionItem = ["action-items", "closed"].includes(stage)

  function progressionDisabled() {
    const noIdeasCreated = stage === "idea-generation" && !ideas.length
    const noActionItemsCreated = stage === "action-items" && !ideas.some(idea => idea.category === "action-item")
    return noIdeasCreated || noActionItemsCreated
  }

  function renderFormOrVoteCounter() {
    if (stage === "voting") {
      return (<VotesLeft currentUser={props.currentUser} />)
    }

    return (
      <div className="thirteen wide column">
        <IdeaSubmissionForm {...props} showActionItem={showActionItem} />
      </div>
    )
  }

  return (
    <LowerThirdWrapper displayContents={stage !== "closed"}>
      {renderFormOrVoteCounter()}
      <div className="three wide right aligned column">
        { isFacilitator &&
          <StageProgressionButton
            {...props}
            config={stageConfig}
            buttonDisabled={progressionDisabled()}
          />
        }
      </div>
    </LowerThirdWrapper>
  )
}

LowerThird.defaultProps = {
  currentUser: { is_facilitator: false },
}

LowerThird.propTypes = {
  currentUser: AppPropTypes.user,
  ideas: AppPropTypes.ideas.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: PropTypes.string.isRequired,
}

export default LowerThird
