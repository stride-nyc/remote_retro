import React from "react"
import PropTypes from "prop-types"
import styles from "./css_modules/shadowed_scroll_container.css"

const detectIE = () => {
  const ua = window.navigator.userAgent

  const msie = ua.indexOf("MSIE ")
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10)
  }

  const trident = ua.indexOf("Trident/")
  if (trident > 0) {
    // IE 11 => return version number
    const rv = ua.indexOf("rv:")
    return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10)
  }

  const edge = ua.indexOf("Edge/")
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10)
  }

  // other browser
  return false
}

const ShadowedScrollContainer = ({ children }) => {
  return (
    <div className={styles.overlay}>
      <div className="shadowContainer">
        <div className="radialShadowTop" />
        <div className="radialShadowBottom" />
      </div>
      <div className={`content ${detectIE() ? "apply-height-for-IE" : ""}`}>
        <div className="shadowCoverTop" />
        {children}
        <div className="shadowCoverBottom" />
      </div>
    </div>
  )
}

ShadowedScrollContainer.propTypes = {
  children: PropTypes.any.isRequired,
}

export default ShadowedScrollContainer
