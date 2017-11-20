import React from "react"

import IdeaGenerationLowerThirdContent from "./idea_generation_lower_third_content"
import VotingLowerThirdContent from "./voting_lower_third_content"
import LowerThirdAnimationWrapper from "./lower_third_animation_wrapper"
import stageConfigs from "../configs/stage_configs"

import * as AppPropTypes from "../prop_types"
import STAGES from "../configs/stages"

const { VOTING, CLOSED } = STAGES

const LowerThird = props => {
  const { stage } = props

  const stageConfig = stageConfigs[stage]

  function stageSpecificContent() {
    if (stage === VOTING) {
      return <VotingLowerThirdContent {...props} config={stageConfig} />
    }

    return <IdeaGenerationLowerThirdContent {...props} config={stageConfig} />
  }

  return (
    <LowerThirdAnimationWrapper displayContents={stage !== CLOSED} stage={stage}>
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
  stage: AppPropTypes.stage.isRequired,
}

export default LowerThird
