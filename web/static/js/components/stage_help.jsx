import React from "react"
import ReactDOM from "react-dom"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { actions } from "../redux/retro"

import * as AppPropTypes from "../prop_types"
import STAGES from "../configs/stages"

export const StageHelp = props => {
  const handleClick = () => {
    const { retro, actions: { showStageHelp } } = props
    showStageHelp(retro)
  }

  const showIcon = () => {
    const { retro: { stage } } = props
    const validHelpStages = [
      STAGES.PRIME_DIRECTIVE,
      STAGES.IDEA_GENERATION,
      STAGES.GROUPING,
      STAGES.VOTING,
      STAGES.ACTION_ITEMS,
      STAGES.CLOSED,
    ]
    return validHelpStages.includes(stage)
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

const mapStateToProps = state => {
  return {
    retro: state.retro,
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
})

StageHelp.propTypes = {
  retro: AppPropTypes.retro.isRequired,
  actions: AppPropTypes.actions.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(StageHelp)
