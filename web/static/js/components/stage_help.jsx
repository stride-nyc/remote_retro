import React from "react"
import ReactDOM from "react-dom"

import * as AppPropTypes from "../prop_types"

export const StageHelp = props => {
  const { stageConfig, actions } = props

  const handleClick = () => {
    const { showStageHelp } = actions
    showStageHelp(stageConfig.help)
  }

  if (stageConfig.help) {
    return ReactDOM.createPortal(
      <button
        className="portal"
        title="Access Stage Information"
        onClick={handleClick}
      >
        <i
          className="question circle outline icon"
        />
      </button>,
      document.getElementById("stage-help-icon")
    )
  }

  return null
}

StageHelp.propTypes = {
  stageConfig: AppPropTypes.stageConfig.isRequired,
  actions: AppPropTypes.actions.isRequired,
}

export default StageHelp
