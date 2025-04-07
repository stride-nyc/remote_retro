// TODO: Remove file in this ticket: https://stride-beach.atlassian.net/browse/RR-48
import React from "react"
import PropTypes from "prop-types"
import isFinite from "lodash/isFinite"

import IdeaContentBase from "./idea_content_base"

import * as AppPropTypes from "../prop_types"


// TODO: These need to be removed

// Keep these exports for compatibility with GroupingIdeaCard
// http://react-dnd.github.io/react-dnd/docs/api/drag-source#drag-source-specification
export const dragSourceSpec = {
  beginDrag: ({ idea }) => {
    const { id, category, body, assignee_id } = idea // eslint-disable-line camelcase

    return {
      draggedIdea: { id, category, body, assignee_id },
    }
  },
  canDrag: ({ idea }) => {
    return !idea.inEditState
  },
  endDrag: ({ idea, actions }) => {
    const { id, x, y } = idea

    const dragOccursBetweenIdeaColumns = !isFinite(x)
    if (dragOccursBetweenIdeaColumns) { return }

    actions.submitIdeaEditAsync({ id, x, y })
  },
}

// TODO: These need to be removed
// collects props as drag events begin and end
// http://react-dnd.github.io/react-dnd/docs/api/drag-source#the-collecting-function
export const collect = connect => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
  }
}

// DO WE EVEN NEED THIS COMPONENT?
const DraggableIdeaContent = props => {
  const { idea, ...rest } = props

  return (
    <IdeaContentBase idea={idea} {...rest} />
  )
}

DraggableIdeaContent.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
  assignee: AppPropTypes.presence,
  canUserEditIdeaContents: PropTypes.bool.isRequired,
  isTabletOrAbove: PropTypes.bool.isRequired,
}

export default DraggableIdeaContent
