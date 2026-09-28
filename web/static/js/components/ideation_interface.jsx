import React from "react"

// eslint-disable-next-line import/no-cycle -- intentional config-driven component resolution
import IdeaBoard from "./idea_board"
import UserList from "./user_list"
import LowerThird from "./lower_third"

import styles from "./css_modules/ideation_interface.css"

function IdeationInterface(props) {
  return (
    <div className={styles.wrapper}>
      <IdeaBoard {...props} />
      <UserList wrap={false} />
      <LowerThird {...props} />
    </div>
  )
}

export default IdeationInterface
