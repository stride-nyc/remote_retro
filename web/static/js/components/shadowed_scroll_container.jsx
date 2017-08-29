import React from "react"
import PropTypes from "prop-types"
import styles from "./css_modules/shadowed_scroll_container.css"

const ShadowedScrollContainer = props => (
  <div className={styles.overlay}>
    <div className="shadowContainer">
      <div className="radialShadowTop" />
      <div className="radialShadowBottom" />
    </div>
    <div className="content" style={{ maxHeight: props.contentMaxHeight }}>
      <div className="shadowCoverTop" />
      {props.children}
      <div className="shadowCoverBottom" />
    </div>
  </div>
)

ShadowedScrollContainer.propTypes = {
  contentMaxHeight: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
}

export default ShadowedScrollContainer
