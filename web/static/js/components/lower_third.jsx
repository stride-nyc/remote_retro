import React from "react"

import IdeaSubmissionLowerThirdContent from "./idea_submission_lower_third_content"
import VotingLowerThirdContent from "./voting_lower_third_content"
import LabelingLowerThirdContent from "./labeling_lower_third_content"
import ClosedLowerThirdContent from "./closed_lower_third_content"
import GroupingLowerThirdContent from "./grouping_lower_third_content"
import LowerThirdAnimationWrapper from "./lower_third_animation_wrapper"

import * as AppPropTypes from "../prop_types"
import STAGES from "../configs/stages"

const {
  VOTING,
  GROUPS_LABELING,
  GROUPS_VOTING,
  GROUPING,
  IDEA_GENERATION,
  ACTION_ITEMS,
  GROUPS_ACTION_ITEMS,
  CLOSED,
  GROUPS_CLOSED,
} = STAGES

const stageToComponentMap = {
  [IDEA_GENERATION]: IdeaSubmissionLowerThirdContent,
  [GROUPING]: GroupingLowerThirdContent,
  [VOTING]: VotingLowerThirdContent,
  [GROUPS_LABELING]: LabelingLowerThirdContent,
  [GROUPS_VOTING]: VotingLowerThirdContent,
  [ACTION_ITEMS]: IdeaSubmissionLowerThirdContent,
  [GROUPS_ACTION_ITEMS]: IdeaSubmissionLowerThirdContent,
  [CLOSED]: ClosedLowerThirdContent,
  [GROUPS_CLOSED]: ClosedLowerThirdContent,
}

const LowerThird = props => {
  const { stage } = props

  const StageSpecificComponent = stageToComponentMap[stage]

  return (
    <LowerThirdAnimationWrapper stage={stage} key={stage}>
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
