import React from "react"

import IdeaGenerationLowerThirdContent from "./idea_generation_lower_third_content"
import VotingLowerThirdContent from "./voting_lower_third_content"
import ClosedLowerThirdContent from "./closed_lower_third_content"
import GroupingLowerThirdContent from "./grouping_lower_third_content"
import GroupNamingLowerThirdContent from "./group_naming_lower_third_content"
import LowerThirdAnimationWrapper from "./lower_third_animation_wrapper"

import * as AppPropTypes from "../prop_types"
import STAGES from "../configs/stages"

const { VOTING, CLOSED, GROUPING, GROUP_NAMING, IDEA_GENERATION, ACTION_ITEMS } = STAGES

const stageToComponentMap = {
  [IDEA_GENERATION]: IdeaGenerationLowerThirdContent,
  [GROUPING]: GroupingLowerThirdContent,
  [GROUP_NAMING]: GroupNamingLowerThirdContent,
  [VOTING]: VotingLowerThirdContent,
  [ACTION_ITEMS]: IdeaGenerationLowerThirdContent,
  [CLOSED]: ClosedLowerThirdContent,
}

const LowerThird = props => {
  const { stage } = props

  const StageSpecificComponent = stageToComponentMap[stage]

  return (
    <LowerThirdAnimationWrapper stage={stage}>
      <StageSpecificComponent {...props} />
    </LowerThirdAnimationWrapper>
  )
}

LowerThird.propTypes = {
  currentUser: AppPropTypes.presence.isRequired,
  ideas: AppPropTypes.ideas.isRequired,
  stage: AppPropTypes.stage.isRequired,
  stageConfig: AppPropTypes.stageConfig.isRequired,
}

export default LowerThird
