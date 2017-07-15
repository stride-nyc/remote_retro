import React from "react"

import UserList from "./user_list"
import IdeaBoard from "./idea_board"
import IdeaGenerationLowerThird from "./idea_generation_lower_third"

import DoorChime from "./door_chime"

import styles from "./css_modules/room.css"

const Room = props => (
  <section className={styles.wrapper}>
    <IdeaBoard {...props} />
    <UserList {...props} />
    <IdeaGenerationLowerThird {...props} />
    <DoorChime {...props} />
  </section>
)

export default Room
