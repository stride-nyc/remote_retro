import React from "react"
import { DropTarget } from "react-dnd"
import PropTypes from "prop-types"
import cx from "classnames"
import orderBy from "lodash/orderBy"

import GroupingIdeaCard from "./grouping_idea_card"
import DragCoordinates from "../services/drag_coordinates"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/grouping_board.css"

const IDEA_COUNT_AT_WHICH_TO_TRIGGER_REAL_ESTATE_PRESERVATION = 35

export const GroupingBoard = props => {
  const { ideas, actions, connectDropTarget, userOptions } = props

  const eligibleDragAreaClassname = cx(styles.eligibleDragArea, "grouping-board")
  const sideGutterClassname = cx(styles.sideGutter, "ui inverted basic padded segment")
  const bottomGutterClassname = cx(styles.bottomGutter, "ui inverted basic segment")

  const cardClassName = cx({
    minimized: ideas.length > IDEA_COUNT_AT_WHICH_TO_TRIGGER_REAL_ESTATE_PRESERVATION,
  })

  const ideasSortedByBodyLengthAscending = orderBy(ideas, ["body.length", "id"], ["desc", "asc"])

  return (
    <React.Fragment>
      <div className={styles.boardAndSideGutterWrapper}>
        {
          connectDropTarget(
            <div className={eligibleDragAreaClassname}>
              {ideasSortedByBodyLengthAscending.map(idea => (
                <GroupingIdeaCard
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
        <div className={sideGutterClassname}>
          <h2 className="ui inverted header">
            <div className="content">
              <div className="sub header">To ensure a consistent experience across devices, this space is non-draggable.</div>
            </div>
          </h2>
        </div>
      </div>
      <div className={bottomGutterClassname} />
    </React.Fragment>
  )
}

GroupingBoard.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  userOptions: AppPropTypes.userOptions.isRequired,
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
