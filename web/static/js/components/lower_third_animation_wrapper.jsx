import React from "react"
import PropTypes from "prop-types"
import { TransitionGroup, CSSTransition } from "react-transition-group"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/lower_third_animation_wrapper.css"

const LowerThirdAnimationWrapper = ({ children, stage }) => {
  return (
    <TransitionGroup
      component="div"
      className={styles.index}
    >
      <CSSTransition
        classNames="translateY"
        appear
        in
        timeout={{
          appear: 700,
          enter: 700,
          exit: 450,
        }}
      >
        <div key={stage}>
          {children}
        </div>
      </CSSTransition>
    </TransitionGroup>
  )
}

LowerThirdAnimationWrapper.propTypes = {
  stage: AppPropTypes.stage.isRequired,
  children: PropTypes.node.isRequired,
}

export default LowerThirdAnimationWrapper
