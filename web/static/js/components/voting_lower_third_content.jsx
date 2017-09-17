import React from "react"

import VotesLeft from "./votes_left"
import StageProgressionButton from "./stage_progression_button"

import * as AppPropTypes from "../prop_types"

const VotingLowerThirdContent = props => (
  <div className="ui stackable grid basic attached secondary center aligned segment">
    <VotesLeft currentUser={props.currentUser} />
    <div className="five wide computer eight wide tablet column">
      <StageProgressionButton {...props} />
    </div>
  </div>
)

VotingLowerThirdContent.propTypes = {
  currentUser: AppPropTypes.user.isRequired,
}

export default VotingLowerThirdContent
