import React, { useState, useEffect } from "react"
import { DndContext, useDroppable, useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

import PropTypes from "prop-types"
import cx from "classnames"
import { last } from "lodash"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/grouping_board.css"

export const GroupingBoard = props => {
  const { ideas, actions, connectDropTarget = node => node, userOptions } = props

  const [isDropped, setIsDropped] = useState(false)

  const [activeId, setActiveId] = useState(null)

  const eligibleDragAreaClassname = cx(styles.eligibleDragArea, "grouping-board")
  const sideGutterClassname = cx(styles.sideGutter, "ui inverted basic padded segment")
  const bottomGutterClassname = cx(styles.bottomGutter, "ui inverted basic segment")

  const handleDragEnd = ({ active, delta }) => {
    setCoordinates(({ x, y }) => {
      return {
        x: x + delta.x,
        y: y + delta.y,
      }
    })
  }

  const [{ x, y }, setCoordinates] = useState({ x: 0, y: 0 })

  const draggableObjs = [{ id: "draggable-1", label: "Number one" }, { id: "draggable-2", label: "Number two" }]

  return (
    <React.Fragment>
      <div className={styles.boardAndSideGutterWrapper}>
        {/* Should this move higher up the tree? */}
        {/* Setup a11y */}
        {/* Figure out collsion detection */}
        {/* Remove old stuff, including tests */}
        {/* Tests */}
        {/* Dragging outside the bounding box */}
        <DndContext onDragEnd={handleDragEnd}>
          <div className={eligibleDragAreaClassname}>
            {draggableObjs.map(({ id, label }) => {
              return (
                <Draggable key={id} id={id} top={y} left={x}>{label}</Draggable>
              )
            })}
          </div>
        </DndContext>
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
  connectDropTarget: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
}

export default GroupingBoard

// const Droppable = ({ children }) => {
//   const { isOver, setNodeRef } = useDroppable({
//     id: "droppable",
//   })
//   const style = {
//     color: isOver ? "green" : undefined,
//     height: "100%",
//     backgroundColor: "pink",
//   }

//   return (
//     <div ref={setNodeRef} style={style}>
//       {children}
//     </div>
//   )
// }


function Draggable({ id, top, left, children }) {
  // const [lastTransform, setLastTransform] = useState(null)


  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  })

  // const currentTransform = lastTransform || transform
  const style = {
    position: "relative",
    top,
    left,
    transform: CSS.Translate.toString(transform),
  }

  // useEffect(() => {
  //   if (transform) {
  //     setLastTransform(transform)
  //   }
  // }, [transform])

  return (
    <button type="button" ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  )
}
