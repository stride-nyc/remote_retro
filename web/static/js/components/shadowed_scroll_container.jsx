import React from "react"
import PropTypes from "prop-types"

const ShadowedScrollContainer = props => (
  <div className="overlay">
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
