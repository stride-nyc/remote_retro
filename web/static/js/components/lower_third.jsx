import React from "react"
import PropTypes from "prop-types"

import IdeaGenerationLowerThirdContent from "./idea_generation_lower_third_content"
import VotingLowerThirdContent from "./voting_lower_third_content"
import LowerThirdAnimationWrapper from "./lower_third_animation_wrapper"
import stageConfigs from "../configs/stage_configs"

import * as AppPropTypes from "../prop_types"

const LowerThird = props => {
  const { stage } = props

  const stageConfig = stageConfigs[stage]

  function stageSpecificContent() {
    if (stage === "voting") {
      return <VotingLowerThirdContent {...props} config={stageConfig} />
    }

    return <IdeaGenerationLowerThirdContent {...props} config={stageConfig} />
  }

  return (
    <LowerThirdAnimationWrapper displayContents={stage !== "closed"} stage={stage}>
      {stageSpecificContent()}
    </LowerThirdAnimationWrapper>
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
