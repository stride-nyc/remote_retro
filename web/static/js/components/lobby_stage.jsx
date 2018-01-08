import React from "react"
import PropTypes from "prop-types"

import UserList from "./user_list"
import StageProgressionButton from "./stage_progression_button"
import ShareRetroLinkModal from "./share_retro_link_modal"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/centered_text.css"

export const instructionText = (userIsFacilitator, facilitatorName) => {
  if (userIsFacilitator) {
    return "it will be your responsibility to start the retro, which you can do by clicking the button below."
  }
  return `your facilitator, ${facilitatorName}, will begin the retro. Until then, hold tight!`
}

const LobbyStage = props => {
  const { progressionConfig, currentUser, isFacilitator, users } = props
  const facilitator = users.find(user => user.is_facilitator)
  const facilitatorName = facilitator ? facilitator.given_name : ""
  const instructions = instructionText(isFacilitator, facilitatorName)

  return (
    <div className="ui centered grid">
      <div className="thirteen wide mobile eight wide tablet five wide computer column">
        <div className={styles.centeredText}>
          <h1 className="ui dividing header">Retro Lobby</h1>
          <p>
            Hi, {currentUser.given_name}! Welcome to RemoteRetro!
            Once your party has arrived, {instructions}
          </p>
        </div>
      </div>
      <div className="row">
        <UserList {...props} />
      </div>
      <div className="row">
        <div className="thirteen wide mobile eight wide tablet four wide computer column">
          <StageProgressionButton {...props} config={progressionConfig} />
        </div>
      </div>
      <ShareRetroLinkModal />
    </div>
  )
}

LobbyStage.propTypes = {
  progressionConfig: PropTypes.object.isRequired,
  currentUser: AppPropTypes.user.isRequired,
  isFacilitator: PropTypes.bool.isRequired,
  users: AppPropTypes.users.isRequired,
}

export default LobbyStage
