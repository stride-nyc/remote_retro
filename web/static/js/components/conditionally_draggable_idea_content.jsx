import React from "react"
import PropTypes from "prop-types"

import DraggableIdeaContent from "./draggable_idea_content"
import IdeaContentBase from "./idea_content_base"

import * as AppPropTypes from "../prop_types"
import STAGES from "../configs/stages"

const { IDEA_GENERATION } = STAGES

const ConditionallyDraggableIdeaContent = props => {
  const {
    stage,
    canUserEditIdeaContents,
    isTabletOrAbove,
  } = props

  const isIdeaGeneration = stage === IDEA_GENERATION

  const isIdeaDragEligible = isTabletOrAbove && isIdeaGeneration && canUserEditIdeaContents

  return isIdeaDragEligible ? (
    <DraggableIdeaContent {...props} />
  ) : (
    <IdeaContentBase {...props} />
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
