import React from "react"

import VotesLeft from "./votes_left"
import StageProgressionButton from "./stage_progression_button"

import * as AppPropTypes from "../prop_types"

const VotingLowerThirdContent = props => (
  <div className="ui stackable grid basic attached secondary center aligned segment">
    {props.currentUser.is_facilitator && <div className="three wide column ui computer tablet only" />}
    <div className="ten wide column">
      <VotesLeft currentUser={props.currentUser} />
    </div>
    {props.currentUser.is_facilitator && <div className="three wide column">
      <StageProgressionButton {...props} />
    </div>
    }
  </div>
)

VotingLowerThirdContent.propTypes = {
  currentUser: AppPropTypes.presence.isRequired,
}

export default VotingLowerThirdContent
