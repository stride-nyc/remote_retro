import React from "react"
import * as AppPropTypes from "../prop_types"

const Room = props => {
  const { stageConfig } = props

  const StageUIComponent = stageConfig.uiComponent

  return (<StageUIComponent {...props} />)
}

Room.propTypes = {
  stageConfig: AppPropTypes.stageConfig.isRequired,
}

export default Room
