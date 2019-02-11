import React from "react"

import IdeaGenerationLowerThirdContent from "./idea_generation_lower_third_content"
import VotingLowerThirdContent from "./voting_lower_third_content"
import ClosedLowerThirdContent from "./closed_lower_third_content"
import GroupingLowerThirdContent from "./grouping_lower_third_content"
import LowerThirdAnimationWrapper from "./lower_third_animation_wrapper"
import stageConfigs from "../configs/stage_configs"

import * as AppPropTypes from "../prop_types"
import STAGES from "../configs/stages"

const { VOTING, CLOSED, GROUPING, IDEA_GENERATION, ACTION_ITEMS } = STAGES

const stageToComponentMap = {
  [IDEA_GENERATION]: IdeaGenerationLowerThirdContent,
  [GROUPING]: GroupingLowerThirdContent,
  [VOTING]: VotingLowerThirdContent,
  [ACTION_ITEMS]: IdeaGenerationLowerThirdContent,
  [CLOSED]: ClosedLowerThirdContent,
}

const LowerThird = props => {
  const { stage } = props

  const stageConfig = stageConfigs[stage]
  const StageSpecificComponent = stageToComponentMap[stage]

  return (
    <LowerThirdAnimationWrapper stage={stage}>
      <StageSpecificComponent {...props} config={stageConfig} />
    </LowerThirdAnimationWrapper>
  )
}

LowerThird.propTypes = {
  currentUser: AppPropTypes.presence.isRequired,
  ideas: AppPropTypes.ideas.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: AppPropTypes.stage.isRequired,
}

export default LowerThird
