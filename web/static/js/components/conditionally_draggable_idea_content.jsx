import React from "react"
import PropTypes from "prop-types"

import DraggableIdeaContent from "./draggable_idea_content"
import IdeaContentBase from "./idea_content_base"

import * as AppPropTypes from "../prop_types"
import STAGES from "../configs/stages"

const { IDEA_GENERATION } = STAGES

const ConditionallyDraggableIdeaContent = ({
  stage,
  canUserEditIdeaContents,
  isTabletOrAbove,
  assignee = null,
  ...props
}) => {
  const isIdeaGeneration = stage === IDEA_GENERATION

  const isIdeaDragEligible = isTabletOrAbove && isIdeaGeneration && canUserEditIdeaContents

  return isIdeaDragEligible ? (
    <DraggableIdeaContent {...props} assignee={assignee} />
  ) : (
    <IdeaContentBase {...props} assignee={assignee} />
  )
}

ConditionallyDraggableIdeaContent.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
  assignee: AppPropTypes.presence.isRequired,
  canUserEditIdeaContents: PropTypes.bool.isRequired,
  isTabletOrAbove: PropTypes.bool.isRequired,
}

export default ConditionallyDraggableIdeaContent
