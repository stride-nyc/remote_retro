import React from "react"

import IdeaBoard from "./idea_board"
import UserList from "./user_list"
import LowerThird from "./lower_third"

import styles from "./css_modules/idea_generation_stage.css"
import { IDEA_GENERATION_CATEGORIES } from "../configs/retro_configs"

const IdeaGenerationStage = props => (
  <div className={styles.wrapper}>
    <IdeaBoard {...props} categories={IDEA_GENERATION_CATEGORIES} />
    <UserList wrap={false} />
    <LowerThird {...props} />
  </div>
)

export default IdeaGenerationStage
