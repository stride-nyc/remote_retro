import React from "react"
import PropTypes from "prop-types"

import IdeaSubmissionForm from "./idea_submission_form"
import LowerThirdWrapper from "./lower_third_wrapper"
import StageProgressionButton from "./stage_progression_button"
import stageConfigs from "../configs/stage_configs"
import { voteMax } from "../configs/retro_configs"

import * as AppPropTypes from "../prop_types"

const IdeaGenerationLowerThird = props => {
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
      const userVoteCount = currentUser.vote_count
      const votesLeft = userVoteCount ? voteMax - userVoteCount : voteMax
      const votesText = votesLeft === 1 ? "Vote Left" : "Votes Left"
      return (
        <div className="sixteen wide column">
          <h2 className="ui header">
            {votesLeft}
            <div className="sub header">{votesText}</div>
          </h2>
        </div>
      )
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

IdeaGenerationLowerThird.defaultProps = {
  currentUser: { is_facilitator: false },
}

IdeaGenerationLowerThird.propTypes = {
  currentUser: AppPropTypes.user,
  ideas: AppPropTypes.ideas.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: PropTypes.string.isRequired,
}

export default IdeaGenerationLowerThird
