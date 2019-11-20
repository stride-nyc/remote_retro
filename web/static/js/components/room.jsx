import React from "react"
import PropTypes from "prop-types"
import PrimeDirectiveStage from "./prime_directive_stage"
import LobbyStage from "./lobby_stage"
import IdeaGenerationStage from "./idea_generation_stage"
import GroupingStage from "./grouping_stage"
import GroupNamingStage from "./group_naming_stage"
import STAGES from "../configs/stages"

import * as AppPropTypes from "../prop_types"

const { LOBBY, PRIME_DIRECTIVE, GROUPING, GROUP_NAMING } = STAGES

const Room = props => {
  let roomContents
  const { stage, currentUser: { is_facilitator: isFacilitator } } = props

  if (stage === LOBBY) {
    roomContents = (
      <LobbyStage
        {...props}
        isFacilitator={isFacilitator}
      />
    )
  } else if (stage === PRIME_DIRECTIVE) {
    roomContents = (
      <PrimeDirectiveStage
        {...props}
        isFacilitator={isFacilitator}
      />
    )
  } else if (stage === GROUPING) {
    roomContents = (
      <GroupingStage
        {...props}
        isFacilitator={isFacilitator}
      />
    )
  } else if (stage === GROUP_NAMING) {
    roomContents = (
      <GroupNamingStage
        {...props}
        isFacilitator={isFacilitator}
      />
    )
  } else {
    roomContents = <IdeaGenerationStage {...props} />
  }

  return roomContents
}

Room.propTypes = {
  stage: AppPropTypes.stage.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  actions: PropTypes.object.isRequired,
}

export default Room
