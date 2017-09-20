import React from "react"
import PropTypes from "prop-types"
import styles from "./css_modules/animated_ellipsis.css"
import cx from "classnames"

const AnimatedEllipsis = ({ animated }) => (
  <div className={cx(styles.index, {[styles.animated]: animated})}>
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
