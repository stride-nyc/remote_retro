import React, { PropTypes } from "react"
import PrimeDirectiveStage from "./prime_directive_stage"
import IdeaGenerationStage from "./idea_generation_stage"
import stageProgressionConfigs from "../configs/stage_progression_configs"

import * as AppPropTypes from "../prop_types"

const Room = props => {
  let roomContents
  if (props.stage === "prime-directive") {
    const isFacilitator = props.currentUser.is_facilitator
    const progressionConfig = stageProgressionConfigs[props.stage]
    roomContents = (
      <PrimeDirectiveStage
        {...props}
        progressionConfig={progressionConfig}
        isFacilitator={isFacilitator}
      />
    )
  } else {
    roomContents = (
      <IdeaGenerationStage
        {...props}
      />
    )
  }

  return roomContents
}

Room.defaultProps = {
  currentUser: { is_facilitator: false },
}

Room.propTypes = {
  stage: PropTypes.string.isRequired,
  currentUser: AppPropTypes.user,
}

export default Room
