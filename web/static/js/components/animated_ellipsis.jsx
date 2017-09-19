import React from "react"
import PropTypes from "prop-types"
import styles from "./css_modules/animated_ellipsis.css"

const AnimatedEllipsis = ({ animated }) => (
  <div className={`${styles.index} ${animated ? styles.animated : ""}`}>
    <i className="circle icon" />
    <i className="circle icon" />
    <i className="circle icon" />
  </div>
)

AnimatedEllipsis.propTypes = {
  animated: PropTypes.bool,
}

AnimatedEllipsis.defaultProps = {
  animated: false,
}

export default AnimatedEllipsis
