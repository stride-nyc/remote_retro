import React from "react"
import { DropTarget } from "react-dnd"
import PropTypes from "prop-types"
import cx from "classnames"

import GroupingStageIdeaCard from "./grouping_stage_idea_card"
import DragCoordinates from "../services/drag_coordinates"
import * as AppPropTypes from "../prop_types"

const IDEA_COUNT_AT_WHICH_TO_TRIGGER_REAL_ESTATE_PRESERVATION = 35

export const GroupingBoard = props => {
  const { ideas, actions, connectDropTarget, userOptions } = props

  const cardClassName = cx({
    minimized: ideas.length > IDEA_COUNT_AT_WHICH_TO_TRIGGER_REAL_ESTATE_PRESERVATION,
  })

  return connectDropTarget(
    <div style={{ flex: 1 }} className="grouping-board">
      {ideas.map(idea => (
        <GroupingStageIdeaCard
          idea={idea}
          className={cardClassName}
          key={idea.id}
          actions={actions}
          userOptions={userOptions}
        />
      ))}
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

let memoizedPush = {}

// http://react-dnd.github.io/react-dnd/docs/api/drop-target#drop-target-specification
export const dropTargetSpec = {
  hover: ({ actions }, monitor) => {
    const { draggedIdea } = monitor.getItem()

    const { x, y } = DragCoordinates.reconcileMobileZoomOffsets(monitor)

    // eslint-disable-next-line
    const duplicativeHoverCoordinates =
      x === memoizedPush.x && y === memoizedPush.y && draggedIdea.id === memoizedPush.id

    if (duplicativeHoverCoordinates) { return }

    memoizedPush = { id: draggedIdea.id, x, y }

    actions.ideaDraggedInGroupingStage(memoizedPush)
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
