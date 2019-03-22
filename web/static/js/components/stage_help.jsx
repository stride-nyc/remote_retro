import React from "react"
import ReactDOM from "react-dom"

import * as AppPropTypes from "../prop_types"
import stageConfig from "../configs/stage_configs"

export const StageHelp = props => {
  const handleClick = () => {
    const { retro, actions: { showStageHelp } } = props
    showStageHelp(retro)
  }

  const showIcon = () => {
    const { retro: { stage } } = props
    return stageConfig[stage].help
  }

  if (showIcon()) {
    return ReactDOM.createPortal(
      <div className="portal">
        <i
          title="Access Stage Information"
          className="question circle icon"
          onClick={handleClick}
          onKeyPress={handleClick}
        />
      </div>,
      document.getElementById("stage-help-icon")
    )
  }

  return null
}

StageHelp.propTypes = {
  retro: AppPropTypes.retro.isRequired,
  actions: AppPropTypes.actions.isRequired,
}

export default StageHelp
