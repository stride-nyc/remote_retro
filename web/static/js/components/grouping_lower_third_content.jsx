import PropTypes from "prop-types"
import React from "react"
import * as AppPropTypes from "../prop_types"
import HighContrastButton from "./high_contrast_button"
import StageProgressionButton from "./stage_progression_button"

const GroupingLowerThirdContent = props => {
  const { currentUser, stageConfig, userOptions, actions } = props

  return (
    <div className="ui stackable grid basic attached secondary center aligned segment">
      <HighContrastButton userOptions={userOptions} actions={actions} className="three wide column ui" />
      <div className="ten wide column">
        <div className="ui header">
          Grouping
          <div className="sub header">
            Group Related Items
          </div>
        </div>
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

GroupingLowerThirdContent.propTypes = {
  actions: PropTypes.object.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stageConfig: AppPropTypes.stageConfig.isRequired,
  userOptions: AppPropTypes.userOptions.isRequired,
}

export default GroupingLowerThirdContent
