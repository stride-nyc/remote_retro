import React, { useState, useEffect, useRef, useCallback, forwardRef } from "react"
import { DndContext, useDraggable, rectIntersection } from "@dnd-kit/core"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"
import orderBy from "lodash/orderBy"

import PropTypes from "prop-types"
import cx from "classnames"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/grouping_board.css"

const CATEGORIES_TO_DISPLAY = ["start", "stop", "continue"]

export const GroupingBoard = props => {
  const { ideas, actions, userOptions } = props

  const [positions, setPositions] = useState(null)
  const [activeDraggable, setActiveDraggable] = useState(null)
  // START
  const [groups, setGroups] = useState([]) // Map of card id to group id
  const cardRefs = useRef({})
  // END

  const eligibleDragAreaClassname = cx(styles.eligibleDragArea, "grouping-board")
  const sideGutterClassname = cx(styles.sideGutter, "ui inverted basic padded segment")
  const bottomGutterClassname = cx(styles.bottomGutter, "ui inverted basic segment")

  const ideasSortedByBodyLengthAscending = orderBy(ideas, ["body.length", "id"], ["desc", "asc"])

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
  }

  // REFACTOR INTO SEPARATE FILE?
  const areElementsOverlapping = (rect1, rect2) => {
    return (
      rect1.right > rect2.left
      && rect1.left < rect2.right
      && rect1.bottom > rect2.top
      && rect1.top < rect2.bottom
    )
  }
  // REFACTOR INTO SEPARATE FILE?
  const findOverlappingElements = activeId => {
    const overlappingIds = []
    const activeRect = cardRefs.current[activeId]?.getBoundingClientRect()

    if (!activeRect) return overlappingIds

    Object.entries(cardRefs.current).forEach(([id, ref]) => {
      if (id === activeId || !ref) return

      const rect = ref.getBoundingClientRect()
      if (areElementsOverlapping(activeRect, rect)) {
        overlappingIds.push(id)
      }
    })

    return overlappingIds
  }
  // REFACTOR INTO SEPARATE FILE?
  const findConnectedGroups = () => {
    const cardIds = Object.keys(cardRefs.current).map(Number)
    const groups = {}

    cardIds.forEach(id => {
      groups[id] = new Set([id])
    })

    const mergeGroups = (id1, id2) => {
      const group1 = groups[id1]
      const group2 = groups[id2]

      if (group1 === group2) return

      const mergedGroup = new Set([...group1, ...group2])
      mergedGroup.forEach(memberId => {
        groups[memberId] = mergedGroup
      })
    }

    cardIds.forEach(id => {
      const overlappingIds = findOverlappingElements(id)
      overlappingIds.forEach(overlappingId => mergeGroups(id, overlappingId))
    })

    const result = []
    const processedGroups = new Set()

    cardIds.forEach(id => {
      const group = groups[id]

      if (group.size <= 1 || processedGroups.has(group)) return

      result.push({
        groupId: id,
        cardIds: Array.from(group),
      })

      processedGroups.add(group)
    })

    return result
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

    const newGroups = findConnectedGroups()
    setGroups(newGroups)
  }


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
          collisionDetection={rectIntersection}
          modifiers={[restrictToParentElement]}
        >
          <div className={eligibleDragAreaClassname}>
            {ideasSortedByBodyLengthAscending.map(({ id, body, category }) => {
              const { x = 0, y = 0 } = positions?.[id] ?? {}
              const group = groups.find(group => group.cardIds.includes(id))
              const groupId = group ? group.groupId : null

              return (
                <GroupingCard
                  key={id}
                  id={id}
                  top={y}
                  left={x}
                  isActive={activeDraggable === id}
                  groupId={groupId}
                  ref={el => {
                    cardRefs.current[id] = el
                  }}
                >
                  {/* TODO: Could probably do this more elegantly - want to only display cats for Start/Stop/Continue & remove sentiment categories even tho they exist */}
                  <span>{CATEGORIES_TO_DISPLAY.includes(category) ? `(${category}) ${body}` : body + id}</span>
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

const GroupingCard = forwardRef(({ id, top, left, isActive, groupId, children }, ref) => {
  const { attributes, listeners, setNodeRef: draggableRef, transform } = useDraggable({ id })

  const setRefs = useCallback(element => {
    draggableRef(element)

    if (!ref) return

    if (typeof ref === "function") {
      ref(element)
    } else {
      ref.current = element
    }
  }, [draggableRef, ref])

  const style = {
    position: "relative",
    top,
    left,
    transform: CSS.Translate.toString(transform),
    zIndex: isActive ? 1 : 0,
    backgroundColor: "white",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  }

  // TODO: Colorize different groups
  if (groupId) {
    const color = "pink"
    style.boxShadow = `0 0 0px 2px ${color}`
    style.border = `1px solid ${color}`
  }

  return (
    <button type="button" ref={setRefs} style={style} {...listeners} {...attributes}>
      {children}
      <br />
      Group: {groupId}
    </button>
  )
})
