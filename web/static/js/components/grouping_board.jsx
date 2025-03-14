import React, { useState, useEffect } from "react"
import { DndContext, useDraggable, useDroppable, rectIntersection } from "@dnd-kit/core"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"
import orderBy from "lodash/orderBy"

import PropTypes from "prop-types"
import cx from "classnames"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/grouping_board.css"

export const GroupingBoard = props => {
  const { ideas, actions, connectDropTarget = node => node, userOptions } = props

  const [positions, setPositions] = useState(null)
  const [activeDraggable, setActiveDraggable] = useState(null)
  const [collisions, setCollisions] = useState({})

  const eligibleDragAreaClassname = cx(styles.eligibleDragArea, "grouping-board")
  const sideGutterClassname = cx(styles.sideGutter, "ui inverted basic padded segment")
  const bottomGutterClassname = cx(styles.bottomGutter, "ui inverted basic segment")

  const ideasSortedByBodyLengthAscending = orderBy(ideas, ["body.length", "id"], ["desc", "asc"])
  console.log("actions", actions)
  console.log("userOptions", userOptions)

  useEffect(() => {
    ideasSortedByBodyLengthAscending.forEach(({ id }) => {
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

  const categoriesToDisplay = ["start", "stop", "continue"]

  return (
    <React.Fragment>
      <div className={styles.boardAndSideGutterWrapper}>
        {/* Setup a11y */}
        {/* Figure out collsion detection */}
        {/* Groupings based off collision detection */}
        {/* Remove old stuff, including tests */}
        {/* Tests */}
        {/* Location of cards persists when nav off page */}
        {/* All users see the dragging cards and groupings live - not local state */}
        {/* Styles */}
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          collisionDetection={rectIntersection}
          modifiers={[restrictToParentElement]}
        >
          <div className={eligibleDragAreaClassname}>
            {ideasSortedByBodyLengthAscending.map(({ id, body, category }) => {
              const { x = 0, y = 0 } = positions?.[id] ?? {}
              const isColliding = activeDraggable && activeDraggable !== id && collisions[id]

              return (
                <GroupingCard
                  key={id}
                  id={id}
                  top={y}
                  left={x}
                  isActive={activeDraggable === id}
                  isColliding={isColliding}
                >
                  {/* Could probably do this more elegantly - want to only display cats for Start/Stop/Continue & remove sentiment categories even tho they exist */}
                  <span>{categoriesToDisplay.includes(category) ? `(${category}) ${body}` : body}</span>
                </GroupingCard>
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


function GroupingCard({ id, top, left, isActive, isColliding, children }) {
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
