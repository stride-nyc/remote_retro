import React from "react"

import UserList from "./user_list"
import IdeaBoard from "./idea_board"
import LowerThird from "./lower_third"

import styles from "./css_modules/idea_generation_stage.css"
import { CATEGORIES } from "../configs/retro_configs"

const IdeaGenerationStage = props => (
  <div className={styles.wrapper}>
    <IdeaBoard {...props} categories={CATEGORIES} />
    <UserList />
    <LowerThird {...props} />
  </div>
)

export default IdeaGenerationStage
