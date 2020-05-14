import React from "react"
import PropTypes from "prop-types"

import CenteredTextStageWrapper from "./centered_text_stage_wrapper"
import ShareRetroLinkModal from "./share_retro_link_modal"
import EmailOptInToggle from "./email_opt_in_toggle"

import * as AppPropTypes from "../prop_types"

const facilitatorInstructions = (
  <span>
    As <strong>facilitator</strong> of this retro,
    it will be your responsibility to advance the retro once your party has arrived.
    Get them in here!
  </span>
)

const nonFacilitatorInstructions = facilitatorName => (
  <span>
    Once your party has arrived, your <strong>facilitator</strong>, {facilitatorName}, will
    begin the retro. Until then, hold tight!
  </span>
)

const LobbyStage = props => {
  const { currentUser, facilitatorName } = props
  const bodyMarkup = currentUser.is_facilitator ? facilitatorInstructions
    : nonFacilitatorInstructions(facilitatorName)

  return (
    <CenteredTextStageWrapper
      {...props}
      headerText="Retro Lobby"
      bodyMarkup={bodyMarkup}
    >
      <ShareRetroLinkModal />
      <EmailOptInToggle emailOptIn={currentUser.email_opt_in} actions={{}} />
    </CenteredTextStageWrapper>
  )
}

LobbyStage.propTypes = {
  currentUser: AppPropTypes.presence.isRequired,
  presences: AppPropTypes.presences.isRequired,
  facilitatorName: PropTypes.string.isRequired,
}

export default LobbyStage
