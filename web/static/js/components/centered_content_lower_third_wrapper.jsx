import React from "react"
import PropTypes from "prop-types"

import StageProgressionButton from "./stage_progression_button"
import HighContrastButton from "./high_contrast_button"

import * as AppPropTypes from "../prop_types"

const CenteredLowerThirdContentWrapper = props => {
  const { currentUser, children, stageConfig, userOptions, actions } = props

  return (
    <div className="ui stackable grid basic attached secondary center aligned segment">
      <HighContrastButton 
        userOptions={userOptions} 
        actions={actions}
        className="three wide column ui"
      />
      <div className="ten wide column">
        {children}
      </div>
      {!currentUser.is_facilitator && <div className="three wide column ui computer tablet only" />}
      {currentUser.is_facilitator && (
        <StageProgressionButton
          currentUser={currentUser}
          config={stageConfig.progressionButton}
          className="three wide column"
        />
      )}
    </div>
  )
}

CenteredLowerThirdContentWrapper.propTypes = {
  actions: PropTypes.object.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stageConfig: AppPropTypes.stageConfig.isRequired,
  children: PropTypes.node.isRequired,
  userOptions: AppPropTypes.userOptions.isRequired,
}

export default CenteredLowerThirdContentWrapper
