import React, { PropTypes } from "react"

import UserList from "./user_list"
import IdeaBoard from "./idea_board"
import IdeaGenerationLowerThird from "./idea_generation_lower_third"
import StageProgressionButton from "./stage_progression_button"
import PrimeDirective from "./prime_directive"
import stageProgressionConfigs from "../configs/stage_progression_configs"

import DoorChime from "./door_chime"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/room.css"

const Room = props => {
  if (props.stage === "prime-directive") {
    const isFacilitator = props.currentUser.is_facilitator
    const progressionConfig = stageProgressionConfigs[props.stage]
    return (
      <section className={styles.wrapper}>
        <PrimeDirective />
        <UserList {...props} />
        <div className={styles.stageProgressionButton}>
          { isFacilitator &&
            <StageProgressionButton
              {...props}
              config={progressionConfig}
            />
          }
        </div>
      </section>
    )
  }

  return (
    <section className={styles.wrapper}>
      <IdeaBoard {...props} />
      <UserList {...props} />
      <IdeaGenerationLowerThird {...props} />
      <DoorChime {...props} />
    </section>
  )
}

Room.defaultProps = {
  currentUser: { is_facilitator: false },
}

Room.propTypes = {
  stage: PropTypes.string.isRequired,
  currentUser: AppPropTypes.user,
}

export default Room
