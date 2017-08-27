import React, { PropTypes } from "react"
import styles from "./css_modules/shadowed_scroll_container.css"

const ShadowedScrollContainer = (props) => (
  <div className="overlay">
    <div className="shadowContainer">
      <div className="radialShadowTop"></div>
      <div className="radialShadowBottom"></div>
    </div>
    <div className="content" style={{ maxHeight: props.contentMaxHeight }}>
      <div className="shadowCoverTop"></div>
        {props.children}
      <div className="shadowCoverBottom"></div>
    </div>
  </div>
)

ShadowedScrollContainer.propTypes = {
  contentMaxHeight: PropTypes.string.isRequired,
}

export default ShadowedScrollContainer
