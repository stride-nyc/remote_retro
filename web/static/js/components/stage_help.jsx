import React from "react"
import ReactDOM from "react-dom"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { actions } from "../redux/retro"

import * as AppPropTypes from "../prop_types"
import stageConfig from "../configs/stage_configs"

export const StageHelp = props => {
  const handleClick = () => {
    const { retro, actions: { showStageHelp } } = props
    showStageHelp(retro)
  }

  const showIcon = () => {
    const { retro: { stage } } = props
    return (stageConfig[stage] && stageConfig[stage].help)
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

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
})

StageHelp.propTypes = {
  retro: AppPropTypes.retro.isRequired,
  actions: AppPropTypes.actions.isRequired,
}

export default connect(null, mapDispatchToProps)(StageHelp)
