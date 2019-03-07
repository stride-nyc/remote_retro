import React from "react"
import PropTypes from "prop-types"

import IdeaContentBase from "./idea_content_base"

import * as AppPropTypes from "../prop_types"
import STAGES from "../configs/stages"

const { IDEA_GENERATION, GROUPING } = STAGES

const handleDragStart = props => event => {
  const { idea } = props
  event.dataTransfer.dropEffect = "move"
  // event dataTransfer only supports strings
  event.dataTransfer.setData("idea", JSON.stringify(idea))
}

const ConditionallyDraggableIdeaContent = props => {
  const {
    stage,
    canUserEditIdeaContents,
    isTabletOrAbove,
  } = props

  const isGrouping = stage === GROUPING
  const isIdeaGeneration = stage === IDEA_GENERATION

  const isIdeaDragEligible = isGrouping || (isIdeaGeneration && canUserEditIdeaContents)

  return (
    <IdeaContentBase
      draggable={isIdeaDragEligible && isTabletOrAbove}
      onDragStart={handleDragStart(props)}
      {...props}
    />
  )
}

ConditionallyDraggableIdeaContent.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
  assignee: AppPropTypes.presence,
  canUserEditIdeaContents: PropTypes.bool.isRequired,
  isTabletOrAbove: PropTypes.bool.isRequired,
}

ConditionallyDraggableIdeaContent.defaultProps = {
  assignee: null,
}

export default ConditionallyDraggableIdeaContent
