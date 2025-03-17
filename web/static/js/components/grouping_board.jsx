import React, { useState, useEffect, useRef } from "react"
import { DndContext, useDraggable, useDroppable, rectIntersection } from "@dnd-kit/core"
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
  const [groups, setGroups] = useState({}) // Map of card id to group id
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

  // GEN AI CODE START
  const areElementsOverlapping = (rect1, rect2) => {
    return (
      rect1.right > rect2.left
      && rect1.left < rect2.right
      && rect1.bottom > rect2.top
      && rect1.top < rect2.bottom
    )
  }

  // Function to find all elements overlapping with a given element
  const findOverlappingElements = activeId => {
    const overlappingIds = []
    const activeRect = cardRefs.current[activeId]?.getBoundingClientRect()

    if (!activeRect) return overlappingIds

    // Check each card to see if it's overlapping with the active card
    Object.entries(cardRefs.current).forEach(([id, ref]) => {
      // console.log("foo", cardRefs.current)
      if (id === activeId || !ref) return

      const rect = ref.getBoundingClientRect()
      if (areElementsOverlapping(activeRect, rect)) {
        overlappingIds.push(id)
      }
    })

    return overlappingIds
  }

  // Function to find all connected elements (direct and indirect connections)
  const findConnectedGroups = () => {
    // Start with each element in its own group
    const initialGroups = {}
    Object.keys(cardRefs.current).forEach(id => {
      initialGroups[id] = [id]
    })

    // For each card, find all overlapping cards and merge groups
    Object.keys(cardRefs.current).forEach(id => {
      const overlappingIds = findOverlappingElements(id)

      // If this card is overlapping with other cards, merge their groups
      if (overlappingIds.length > 0) {
        const currentGroup = initialGroups[id]

        overlappingIds.forEach(overlappingId => {
          const overlappingGroup = initialGroups[overlappingId]

          // Skip if they're already in the same group
          if (currentGroup === overlappingGroup) return

          // Merge the groups
          const mergedGroup = [...currentGroup, ...overlappingGroup];

          // Update all cards in both groups to point to the merged group
          [...currentGroup, ...overlappingGroup].forEach(groupId => {
            initialGroups[groupId] = mergedGroup
          })
        })
      }
    })

    // Deduplicate groups
    const uniqueGroups = []
    const processedIds = new Set()

    Object.entries(initialGroups).forEach(([id, group]) => {
      if (!processedIds.has(id)) {
        uniqueGroups.push(group)
        group.forEach(groupId => processedIds.add(groupId))
      }
    })

    // Convert to the format we need: map of card id to group id
    const result = {}
    uniqueGroups.forEach(group => {
      // Only create a group if there's more than one card
      if (group.length > 1) {
        const groupId = group[0] // Use the first card's id as the group id
        group.forEach(cardId => {
          result[cardId] = groupId
        })
      }
    })

    return result
  }

  // GENAI CODE END

  const handleDragEnd = event => {
    const { active, delta } = event

    setPositions(prevPositions => ({
      ...prevPositions,
      [active.id]: {
        x: prevPositions[active.id].x + delta.x,
        y: prevPositions[active.id].y + delta.y,
      },
    }))

    // START
    // Wait for the DOM to update with the new position
    // setTimeout(() => {
    // Find all connected groups
    const newGroups = findConnectedGroups()
    setGroups(newGroups)
    // }, 0)
    // END
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
              const groupId = groups[id]

              return (
                <GroupingCard
                  key={id}
                  id={id}
                  top={y}
                  left={x}
                  isActive={activeDraggable === id}
                  // START
                  groupId={groupId}
                  ref={el => cardRefs.current[id] = el}
                  // END
                >
                  {/* Could probably do this more elegantly - want to only display cats for Start/Stop/Continue & remove sentiment categories even tho they exist */}
                  <span>{CATEGORIES_TO_DISPLAY.includes(category) ? `(${category}) ${body}` : body}</span>
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


const GroupingCard = React.forwardRef(({ id, top, left, isActive, groupId, children }, ref) => {
  const { attributes, listeners, setNodeRef: draggableRef, transform } = useDraggable({
    id,
  })

  const { setNodeRef: droppableRef } = useDroppable({
    id,
  })

  // START
  // Combine the refs
  const setRefs = element => {
    draggableRef(element)
    if (ref) {
      if (typeof ref === "function") {
        ref(element)
      } else {
        ref.current = element
      }
    }
  }
  // END

  const style = {
    position: "relative",
    top,
    left,
    transform: CSS.Translate.toString(transform),
    zIndex: isActive ? 1 : 0,
    backgroundColor: "white",
    padding: "8px",
    // padding: "0px",
    borderRadius: "4px",
  }

  // START
  // TODO: Fix the color setting
  if (groupId) {
    // const hash = Math.abs(String(groupId).split("").reduce((a, b) => {
    //   a = ((a << 5) - a) + b.charCodeAt(0)
    //   return a & a
    // }, 0))
    const color = "pink"

    style.boxShadow = `0 0 0px 2px ${color}`
    style.border = `1px solid ${color}`
  } else {
    style.border = "1px solid #ccc"
  }
  // END

  return (
    <button type="button" ref={setRefs} style={style} {...listeners} {...attributes}>
      {/* <div ref={droppableRef} style={{ padding: "8px" }}> */}
      {children}
      <br />
      Group: {groupId}
      {/* </div> */}
    </button>
  )
})
