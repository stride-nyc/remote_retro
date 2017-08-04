import React, { PropTypes } from "react"
import { CSSTransitionGroup } from "react-transition-group"

import styles from "./css_modules/lower_third_wrapper.css" // eslint-disable-line no-unused-vars

const LowerThirdWrapper = ({ children, displayContents }) => {
  const contents = (
    <div key="herp" className="ui stackable grid basic attached secondary center aligned segment">
      {children}
    </div>
  )

  return (
    <CSSTransitionGroup
      transitionName="translateY"
      transitionAppear
      transitionLeave
      transitionAppearTimeout={700}
      transitionLeaveTimeout={700}
      transitionEnter={false}
    >
      {displayContents && contents}
    </CSSTransitionGroup>
  )
}

LowerThirdWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  displayContents: PropTypes.bool.isRequired,
}

export default LowerThirdWrapper
