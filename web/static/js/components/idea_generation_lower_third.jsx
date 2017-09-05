import React from "react"
import PropTypes from "prop-types"

import IdeaSubmissionForm from "./idea_submission_form"
import LowerThirdWrapper from "./lower_third_wrapper"
import StageProgressionButton from "./stage_progression_button"
import stageConfigs from "../configs/stage_configs"

import * as AppPropTypes from "../prop_types"

const IdeaGenerationLowerThird = props => {
  const { stage, currentUser, ideas } = props

  const isFacilitator = currentUser.is_facilitator
  const stageConfig = stageConfigs[stage]
  const showActionItem = ["action-items", "closed"].includes(stage)
  const voteMax = 5

  function progressionDisabled() {
    const noIdeasCreated = stage === "idea-generation" && !ideas.length
    const noActionItemsCreated = stage === "action-items" && !ideas.some(idea => idea.category === "action-item")
    return noIdeasCreated || noActionItemsCreated
  }

  function renderLowerThirdContents() {
    if (stage === "voting") {
      const userVoteCount = currentUser.vote_count
      const votesLeft = userVoteCount ? voteMax - userVoteCount : voteMax
      const votesText = votesLeft === 1 ? "Vote Left" : "Votes Left"
      return (
        <div>
          <p>{votesLeft} </p>
          <p>{votesText}</p>
        </div>
      )
    }

    return <IdeaSubmissionForm {...props} showActionItem={showActionItem} />
  }

  return (
    <LowerThirdWrapper displayContents={stage !== "closed"}>
      <div className="thirteen wide column">
        {renderLowerThirdContents()}
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
