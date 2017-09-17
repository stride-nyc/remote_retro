import React from "react"
import PropTypes from "prop-types"
import styles from "./css_modules/animated_ellipsis.css"

const AnimatedEllipsis = ({ display }) => (
  <div className={styles.index} style={{ opacity: display ? 1 : 0 }} >
    <i className="circle icon" />
    <i className="circle icon" />
    <i className="circle icon" />
  </div>
)

AnimatedEllipsis.propTypes = {
  display: PropTypes.string.isRequired,
}

export default AnimatedEllipsis
