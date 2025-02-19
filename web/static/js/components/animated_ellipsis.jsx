import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import styles from "./css_modules/animated_ellipsis.css"

const AnimatedEllipsis = ({ animated = false }) => (
  <div className={cx(styles.index, { [styles.animated]: animated })}>
    <i className="circle icon" />
    <i className="circle icon" />
    <i className="circle icon" />
  </div>
)

AnimatedEllipsis.propTypes = {
  animated: PropTypes.bool,
}

export default AnimatedEllipsis
