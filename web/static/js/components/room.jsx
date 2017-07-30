import React, { PropTypes } from "react"
import PrimeDirectiveStage from "./prime_directive_stage"
import IdeaGenerationStage from "./idea_generation_stage"
import stageConfigs from "../configs/stage_configs"

import * as AppPropTypes from "../prop_types"

const Room = props => {
  let roomContents
  if (props.stage === "prime-directive") {
    const isFacilitator = props.currentUser.is_facilitator
    const stageConfig = stageConfigs[props.stage]
    roomContents = (
      <PrimeDirectiveStage
        {...props}
        progressionConfig={stageConfig}
        isFacilitator={isFacilitator}
      />
    )
  } else {
    roomContents = <IdeaGenerationStage {...props} />
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
