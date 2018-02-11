import React from "react"
import PropTypes from "prop-types"

import UserList from "./user_list"
import StageProgressionButton from "./stage_progression_button"
import ShareRetroLinkModal from "./share_retro_link_modal"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/centered_text.css"

const LobbyStage = props => {
  const { progressionConfig, currentUser, facilitatorName } = props
  const instructions = currentUser.is_facilitator ? " As facilitator of this retro, it will be your responsibility to start the retro once your party has arrived. Get them in here!" :
    ` Once your party has arrived, your facilitator, ${facilitatorName}, will begin the retro. Until then, hold tight!`

  return (
    <div className="ui centered grid">
      <div className="thirteen wide mobile eight wide tablet five wide computer column">
        <div className={styles.centeredText}>
          <h1 className="ui dividing header">Retro Lobby</h1>
          <p>
            Hi, {currentUser.given_name}! Welcome to RemoteRetro!
            {instructions}
          </p>
        </div>
      </div>
      <div className="row">
        <h2 className="ui medium dividing header">Current Users</h2>
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
  currentUser: AppPropTypes.presence.isRequired,
  presences: AppPropTypes.presences.isRequired,
  facilitatorName: PropTypes.string.isRequired,
}

export default LobbyStage
