import React, { useState, useEffect } from "react"
import { DndContext, useDroppable, useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

import PropTypes from "prop-types"
import cx from "classnames"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/grouping_board.css"

export const GroupingBoard = props => {
  const { ideas, actions, draggables, connectDropTarget = node => node, userOptions } = props

  const [positions, setPositions] = useState(null)
  const [activeDraggable, setActiveDraggable] = useState(null)


  useEffect(() => {
    draggables.forEach(({ id }) => {
      setPositions(prevPositions => ({
        ...prevPositions,
        [id]: { x: 0, y: 0 },
      }))
    })
  }, [])

  const handleDragStart = ({ active }) => {
    setActiveDraggable(active.id)
  }

  const handleDragEnd = ({ active, delta }) => {
    setPositions(prevPositions => ({
      ...prevPositions,
      [active.id]: {
        x: prevPositions[active.id].x + delta.x,
        y: prevPositions[active.id].y + delta.y,
      },
    }))
  }

  const eligibleDragAreaClassname = cx(styles.eligibleDragArea, "grouping-board")
  const sideGutterClassname = cx(styles.sideGutter, "ui inverted basic padded segment")
  const bottomGutterClassname = cx(styles.bottomGutter, "ui inverted basic segment")

  return (
    <React.Fragment>
      <div className={styles.boardAndSideGutterWrapper}>
        {/* Should this move higher up the tree? */}
        {/* Setup a11y */}
        {/* Figure out collsion detection */}
        {/* Remove old stuff, including tests */}
        {/* Tests */}
        {/* Dragging outside the bounding box */}
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className={eligibleDragAreaClassname}>
            {draggables.map(({ id, label }) => {
              const { x = 0, y = 0 } = positions?.[id] ?? {}

              return (
                <Draggable key={id} id={id} top={y} left={x} isActive={activeDraggable === id}>
                  {label}
                </Draggable>
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


function Draggable({ id, top, left, isActive, children }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  })

  const style = {
    position: "relative",
    top,
    left,
    transform: CSS.Translate.toString(transform),
    zIndex: isActive ? 1 : 0,
  }

  return (
    <button type="button" ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  )
}
