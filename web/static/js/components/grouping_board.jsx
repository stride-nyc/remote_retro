import React from "react"
import { DropTarget } from "react-dnd"
import PropTypes from "prop-types"

import GroupingStageIdeaCard from "./grouping_stage_idea_card"
import GroupingStageCustomDragLayer from "./grouping_stage_custom_drag_layer"
import * as AppPropTypes from "../prop_types"

export const GroupingBoard = props => {
  const { ideas, connectDropTarget } = props

  return connectDropTarget(
    <div style={{ flex: 1 }} className="grouping-board">
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

// http://react-dnd.github.io/react-dnd/docs/api/drop-target#drop-target-specification
export const dropTargetSpec = {
  drop: (props, monitor) => {
    const { draggedIdea } = monitor.getItem()
    const { actions } = props

    const { x, y } = monitor.getSourceClientOffset()

    actions.submitIdeaEditAsync({ id: draggedIdea.id, x, y })
  },
  hover: ({ actions }, monitor) => {
    const { draggedIdea } = monitor.getItem()

    const { x, y } = monitor.getSourceClientOffset()

    actions.ideaDraggedInGroupingStage({ id: draggedIdea.id, x, y })
  },
}

// http://react-dnd.github.io/react-dnd/docs/api/drop-target#the-collecting-function
const collect = connect => ({
  connectDropTarget: connect.dropTarget(),
})

export default DropTarget(
  "GROUPING_STAGE_IDEA_CARD",
  dropTargetSpec,
  collect
)(GroupingBoard)
