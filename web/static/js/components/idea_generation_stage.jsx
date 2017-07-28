import React from "react"

import UserList from "./user_list"
import IdeaBoard from "./idea_board"
import IdeaGenerationLowerThird from "./idea_generation_lower_third"
import DoorChime from "./door_chime"

import styles from "./css_modules/idea_generation_stage.css"

const IdeaGenerationStage = props => (
  <div className={styles.wrapper}>
    <IdeaBoard {...props} />
    <UserList {...props} />
    <IdeaGenerationLowerThird {...props} />
    <DoorChime {...props} />
  </div>
)

export default IdeaGenerationStage
