import React from "react"
import { DragSource } from "react-dnd"
import isFinite from "lodash/isFinite"
import PropTypes from "prop-types"

import IdeaContentBase from "./idea_content_base"

import * as AppPropTypes from "../prop_types"

// http://react-dnd.github.io/react-dnd/docs/api/drag-source#drag-source-specification
export const dragSourceSpec = {
  beginDrag: ({ idea }) => {
    const { id, category, body, assignee_id } = idea  

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

// collects props as drag events begin and end
// http://react-dnd.github.io/react-dnd/docs/api/drag-source#the-collecting-function
export const collect = connect => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
  }
}

const IdeaContentConnected = props => {
  const { connectDragSource, ...rest } = props

  // <connectDragSource requires a native html element for applying drag-n-drop handlers
  return connectDragSource(
    <div>
      <IdeaContentBase {...rest} />
    </div>
  )
}

IdeaContentConnected.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
  assignee: AppPropTypes.presence,
  canUserEditIdeaContents: PropTypes.bool.isRequired,
  isTabletOrAbove: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func,
}

IdeaContentConnected.defaultProps = {
  assignee: null,
  connectDragSource: node => node,
}

export default DragSource(
  "IDEA",
  dragSourceSpec,
  collect
)(IdeaContentConnected)
