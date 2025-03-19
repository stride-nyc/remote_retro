import React, { useState, useEffect, useRef } from "react"
import { DndContext } from "@dnd-kit/core"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import orderBy from "lodash/orderBy"

import PropTypes from "prop-types"
import cx from "classnames"
import GroupingCard from "./grouping_card"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/grouping_board.css"

const CATEGORIES_TO_DISPLAY = ["start", "stop", "continue"]

export const GroupingBoard = props => {
  const { ideas, actions, userOptions } = props

  const [activeDraggable, setActiveDraggable] = useState(null)
  const [groups, setGroups] = useState([])
  const cardRefs = useRef({})

  const eligibleDragAreaClassname = cx(styles.eligibleDragArea, "grouping-board")
  const sideGutterClassname = cx(styles.sideGutter, "ui inverted basic padded segment")
  const bottomGutterClassname = cx(styles.bottomGutter, "ui inverted basic segment")

  const ideasSortedByBodyLengthAscending = orderBy(ideas, ["body.length", "id"], ["desc", "asc"])

  useEffect(() => {
    const newGroups = findConnectedGroups()
    setGroups(newGroups)

    // IN PROGRESS
    const groupsForRedux = newGroups.map(group => {
      const filteredIdeas = ideas
        .filter(idea => group.cardIds.includes(idea.id))
        .map(idea => ({ ...idea, group_id: group.groupId }))

      return {
        id: group.groupId,
        label: `Group ${group.groupId}`,
        ideas: filteredIdeas,
        votes: [],
      }
    })

    console.log("groupsForRedux", groupsForRedux)
    console.log("actions", actions)

    // if (groupsForRedux.length > 0) {
    //   actions.saveGroupingBoardGroups(groupsForRedux)
    // }
  }, [ideas])

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
    const groupings = {}

    cardIds.forEach(id => {
      groupings[id] = new Set([id])
    })

    const mergeGroups = (id1, id2) => {
      const group1 = groupings[id1]
      const group2 = groupings[id2]

      if (group1 === group2) return

      const mergedGroup = new Set([...group1, ...group2])
      mergedGroup.forEach(memberId => {
        groupings[memberId] = mergedGroup
      })
    }

    cardIds.forEach(id => {
      const overlappingIds = findOverlappingElements(id)
      overlappingIds.forEach(overlappingId => mergeGroups(id, overlappingId))
    })

    const result = []
    const processedGroups = new Set()

    cardIds.forEach(id => {
      const group = groupings[id]

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
    const ideaId = active.id

    const currentIdea = ideas.find(idea => idea.id === ideaId)
    const currentX = currentIdea?.x ? currentIdea.x : 0
    const currentY = currentIdea?.y ? currentIdea.y : 0

    const newX = currentX + delta.x
    const newY = currentY + delta.y

    // Update position in the store and persist to server
    actions.ideaDraggedInGroupingStage({ id: ideaId, x: newX, y: newY })
    // When drag ends, submit the final position to be persisted
    actions.submitIdeaEditAsync({ id: ideaId, x: newX, y: newY })

    const newGroups = findConnectedGroups()
    setGroups(newGroups)

    // Convert the detected groups to the format expected by the Redux store
    // and dispatch the action to save them
    const groupsForRedux = newGroups.map(group => {
      return {
        id: group.groupId,
        label: `Group ${group.groupId}`, // Default label
        idea_ids: group.cardIds, // Store the idea IDs associated with this group
      }
    })

    if (groupsForRedux.length > 0) {
      actions.saveGroupingBoardGroups(groupsForRedux)
    }
  }


  return (
    <React.Fragment>
      <div className={styles.boardAndSideGutterWrapper}>
        {/* Setup a11y */}
        {/* x - Figure out collsion detection */}
        {/* x - Groupings based off collision detection */}
        {/* Remove old stuff, including tests */}
        {/* Tests */}
        {/* x - Location of cards persists when nav off page */}
        {/* All users see the dragging cards and groupings live - not local state */}
        {/* x - Styles */}
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement]}
        >
          <div className={eligibleDragAreaClassname}>
            {ideasSortedByBodyLengthAscending.map(idea => {
              const { id, body, category, x = 0, y = 0 } = idea
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
                  userOptions={userOptions}
                  actions={actions}
                  ref={el => {
                    cardRefs.current[id] = el
                  }}
                >
                  {/* TODO: Could probably do this more elegantly - want to only display cats for Start/Stop/Continue & remove sentiment categories even tho they exist */}
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
