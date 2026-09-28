import React from "react"

// eslint-disable-next-line import/no-cycle -- intentional config-driven component resolution
import VotesLeft from "./votes_left"
import CenteredContentLowerThirdWrapper from "./centered_content_lower_third_wrapper"

import * as AppPropTypes from "../prop_types"

function VotingLowerThirdContent(props) {
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
