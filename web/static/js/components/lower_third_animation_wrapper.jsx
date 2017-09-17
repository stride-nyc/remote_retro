import React from "react"
import PropTypes from "prop-types"
import ReactCSSTransitionReplace from "react-css-transition-replace"

import styles from "./css_modules/lower_third_wrapper.css" // eslint-disable-line no-unused-vars

const LowerThirdAnimationWrapper = ({ children, displayContents, stage }) => {
  const contents = (
    <div key={stage}>
      {children}
    </div>
  )

  return (
    <ReactCSSTransitionReplace
      transitionName="translateY"
      overflowHidden={false}
      transitionAppear
      component="div"
      transitionLeave
      transitionAppearTimeout={700}
      transitionLeaveTimeout={700}
      transitionEnter={false}
    >
      {displayContents && contents}
    </ReactCSSTransitionReplace>
  )
}

LowerThirdAnimationWrapper.propTypes = {
  stage: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  displayContents: PropTypes.bool.isRequired,
}

export default LowerThirdAnimationWrapper
