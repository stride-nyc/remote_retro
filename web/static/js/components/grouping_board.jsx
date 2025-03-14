import React, { useState, useEffect } from "react"
import { DndContext, useDraggable, useDroppable, rectIntersection } from "@dnd-kit/core"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"

import PropTypes from "prop-types"
import cx from "classnames"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/grouping_board.css"

export const GroupingBoard = props => {
  const { ideas, actions, draggables, connectDropTarget = node => node, userOptions } = props

  const [positions, setPositions] = useState(null)
  const [activeDraggable, setActiveDraggable] = useState(null)
  const [collisions, setCollisions] = useState({})


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
    // Reset collisions when starting a new drag
    // setCollisions({})
  }

  const handleDragEnd = event => {
    const { active, delta } = event

    setPositions(prevPositions => ({
      ...prevPositions,
      [active.id]: {
        x: prevPositions[active.id].x + delta.x,
        y: prevPositions[active.id].y + delta.y,
      },
    }))

    // Clear collisions after drag ends
    // setCollisions({})
  }

  const handleDragOver = event => {
    const { active, collisions: detectedCollisions } = event

    if (detectedCollisions.length > 0) {
      // Create a map of collisions for the active draggable
      const newCollisions = {}
      detectedCollisions.forEach(collision => {
        newCollisions[collision.id] = true
      })

      setCollisions(newCollisions)
    } else {
      // setCollisions({})
    }
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
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          collisionDetection={rectIntersection}
          modifiers={[restrictToParentElement]}
        >
          <div className={eligibleDragAreaClassname}>
            {draggables.map(({ id, label }) => {
              const { x = 0, y = 0 } = positions?.[id] ?? {}

              const isColliding = activeDraggable && activeDraggable !== id && collisions[id]

              return (
                <Draggable
                  key={id}
                  id={id}
                  top={y}
                  left={x}
                  isActive={activeDraggable === id}
                  isColliding={isColliding}
                >
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


function Draggable({ id, top, left, isActive, isColliding, children }) {
  const { attributes, listeners, setNodeRef: draggableRef, transform } = useDraggable({
    id,
  })

  const { setNodeRef: droppableRef } = useDroppable({
    id,
  })

  const style = {
    position: "relative",
    top,
    left,
    transform: CSS.Translate.toString(transform),
    zIndex: isActive ? 1 : 0,
    border: isColliding ? "1px solid red" : "1px solid #ccc",
    backgroundColor: "white",
    padding: "8px",
    borderRadius: "4px",
    transition: "border-color 0.2s, background-color 0.2s",
  }

  return (
    <button type="button" ref={draggableRef} style={style} {...listeners} {...attributes}>
      <div ref={droppableRef}>
        {children}
      </div>
    </button>
  )
}
