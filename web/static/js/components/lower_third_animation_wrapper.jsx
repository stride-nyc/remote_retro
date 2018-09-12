import React from "react"
import PropTypes from "prop-types"
import ReactCSSTransitionReplace from "react-css-transition-replace"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/lower_third_animation_wrapper.css"

const LowerThirdAnimationWrapper = ({ children, stage }) => {
  return (
    <ReactCSSTransitionReplace
      transitionName="translateY"
      overflowHidden={false}
      transitionAppear
      component="div"
      className={styles.index}
      transitionLeave
      transitionEnter
      transitionEnterTimeout={700}
      transitionAppearTimeout={700}
      transitionLeaveTimeout={450}
    >
      <div key={stage}>
        {children}
      </div>
    </ReactCSSTransitionReplace>
  )
}

LowerThirdAnimationWrapper.propTypes = {
  stage: AppPropTypes.stage.isRequired,
  children: PropTypes.node.isRequired,
}

export default LowerThirdAnimationWrapper
