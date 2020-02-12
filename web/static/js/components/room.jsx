import React from "react"
import * as AppPropTypes from "../prop_types"

const Room = props => {
  const { stageConfig, groups } = props
  const { uiComponent, uiComponentFactory } = stageConfig

  const StageUIComponent = uiComponent || uiComponentFactory({ groups })

  return (<StageUIComponent {...props} />)
}

Room.propTypes = {
  stageConfig: AppPropTypes.stageConfig.isRequired,
  groups: AppPropTypes.groups.isRequired,
}

export default Room
