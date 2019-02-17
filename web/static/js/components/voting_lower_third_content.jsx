import React from "react"

import VotesLeft from "./votes_left"
import CenteredContentLowerThirdWrapper from "./centered_content_lower_third_wrapper"

import * as AppPropTypes from "../prop_types"

const VotingLowerThirdContent = props => {
  const { currentUser } = props

  return (
    <CenteredContentLowerThirdWrapper {...props}>
      <VotesLeft currentUser={currentUser} />
    </CenteredContentLowerThirdWrapper>
  )
}

VotingLowerThirdContent.propTypes = {
  currentUser: AppPropTypes.presence.isRequired,
}

export default VotingLowerThirdContent
