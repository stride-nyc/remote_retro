import React from "react"
import PrimeDirectiveStage from "./prime_directive_stage"
import IdeaGenerationStage from "./idea_generation_stage"
import ActionItemGenerationStage from "./action_item_generation_stage"
import stageConfigs from "../configs/stage_configs"
import STAGES from "../configs/stages"

import * as AppPropTypes from "../prop_types"

const { PRIME_DIRECTIVE } = STAGES

const Room = props => {
  let roomContents
  if (props.stage === PRIME_DIRECTIVE) {
    const isFacilitator = props.currentUser.is_facilitator
    const stageConfig = stageConfigs[props.stage]
    roomContents = (
      <PrimeDirectiveStage
        {...props}
        progressionConfig={stageConfig}
        isFacilitator={isFacilitator}
      />
    )
  } else if (props.stage === "action-items") {
    roomContents = <ActionItemGenerationStage {...props} />
  } else {
    roomContents = <IdeaGenerationStage {...props} />
  }

  return roomContents
}

Room.defaultProps = {
  currentUser: { is_facilitator: false },
}

Room.propTypes = {
  stage: AppPropTypes.stage.isRequired,
  currentUser: AppPropTypes.user,
}

export default Room
