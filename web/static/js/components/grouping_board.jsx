import React from "react"
import { DropTarget } from "react-dnd"
import PropTypes from "prop-types"

import GroupingStageIdeaCard from "./grouping_stage_idea_card"
import GroupingStageCustomDragLayer from "./grouping_stage_custom_drag_layer"
import * as AppPropTypes from "../prop_types"

export const GroupingBoard = props => {
  const { ideas, connectDropTarget } = props

  return connectDropTarget(
    <div style={{ flex: 1 }}>
      {ideas.map(idea => <GroupingStageIdeaCard idea={idea} key={idea.id} />)}

      <GroupingStageCustomDragLayer />
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
