import React from "react"

import IdeaBoard from "./idea_board"
import UserList from "./user_list"
import LowerThird from "./lower_third"

import styles from "./css_modules/ideation_interface.css"

const IdeationInterface = props => (
  <div className={styles.wrapper}>
    <IdeaBoard {...props} />
    <UserList wrap={false} />
    <LowerThird {...props} />
  </div>
)

export default IdeationInterface
