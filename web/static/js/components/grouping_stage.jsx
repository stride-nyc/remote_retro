import React from "react"

import LowerThird from "./lower_third"
import styles from "./css_modules/idea_generation_stage.css"

export default props => {
  return (
    <div className={styles.wrapper}>
      <div style={{ flex: 1 }} />
      <LowerThird {...props} />
    </div>
  )
}
