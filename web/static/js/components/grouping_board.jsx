import React from "react"
import { DropTarget } from "react-dnd"
import { Preview as TouchEventDragPreview } from "react-dnd-multi-backend"
import PropTypes from "prop-types"

import GroupingStageIdeaCard from "./grouping_stage_idea_card"
import * as AppPropTypes from "../prop_types"

// specification for rendering a drag preview on touch devices
// https://github.com/LouisBrunner/dnd-multi-backend/tree/master/packages/react-dnd-multi-backend#preview
const generateTouchEventDragPreview = (type, item, styles) => {
  return <GroupingStageIdeaCard touchEventDragPreviewStyles={styles} idea={item.draggedIdea} />
}

export const GroupingBoard = props => {
  const { ideas, connectDropTarget } = props

  return connectDropTarget(
    <div style={{ flex: 1 }}>
      {ideas.map(idea => <GroupingStageIdeaCard idea={idea} key={idea.id} />)}

      <TouchEventDragPreview generator={generateTouchEventDragPreview} />
    </div>
  )
}

GroupingBoard.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  connectDropTarget: PropTypes.func,
  actions: PropTypes.object.isRequired,
}

GroupingBoard.defaultProps = {
  connectDropTarget: node => node,
}

export const dropTargetSpec = {
  drop: (props, monitor) => {
    const { draggedIdea } = monitor.getItem()
    const { actions } = props

    const { x, y } = monitor.getSourceClientOffset()

    actions.submitIdeaEditAsync({ id: draggedIdea.id, x: x + 1, y })
  },
}

const collect = connect => ({
  connectDropTarget: connect.dropTarget(),
})

export default DropTarget(
  "GROUPING_STAGE_IDEA_CARD",
  dropTargetSpec,
  collect
)(GroupingBoard)
