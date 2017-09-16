import React from "react"
import styles from "./css_modules/animated_ellipsis.css"

const AnimatedEllipsis = ({ display }) => {
  return (
    <div className={styles.index} style={{ opacity: display ? 1 : 0 }} >
      <i className="circle icon" />
      <i className="circle icon" />
      <i className="circle icon" />
    </div>
  )
}

export default AnimatedEllipsis
