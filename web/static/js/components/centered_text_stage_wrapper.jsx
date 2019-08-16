import React from "react"
import PropTypes from "prop-types"
import * as AppPropTypes from "../prop_types"

import StageProgressionButton from "./stage_progression_button"
import UserList from "./user_list"
import styles from "./css_modules/centered_text_stage_wrapper.css"

const CenteredTextStageWrapper = props => {
  const { bodyMarkup, stageConfig, currentUser, children, headerText } = props

  return (
    <div className={`ui centered grid ${styles.index}`}>
      <div className={`sixteen wide mobile eight wide tablet four wide computer column ${styles.variableColumn}`}>
        <h1 className="ui dividing header">
          {headerText}
        </h1>
        {bodyMarkup}
      </div>
      <div className="row">
        <h2 className="ui medium dividing header">Current Users</h2>
        <UserList wrap />
      </div>
      <div className="row">
        <StageProgressionButton
          currentUser={currentUser}
          config={stageConfig.progressionButton}
          className="thirteen wide mobile eight wide tablet four wide computer column"
        />
      </div>
      {children}
    </div>
  )
}

CenteredTextStageWrapper.propTypes = {
  currentUser: AppPropTypes.presence.isRequired,
  stageConfig: PropTypes.object.isRequired,
  bodyMarkup: PropTypes.node.isRequired,
  headerText: PropTypes.string.isRequired,
  children: PropTypes.node,
}

CenteredTextStageWrapper.defaultProps = {
  children: "",
}

export default CenteredTextStageWrapper
