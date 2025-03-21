import React, { useState, useEffect, useRef } from "react"
import { DndContext } from "@dnd-kit/core"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import orderBy from "lodash/orderBy"

import PropTypes from "prop-types"
import cx from "classnames"
import GroupingCard from "./grouping_card"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/grouping_board.css"
import IdeaCardGrouping from "../services/idea_card_grouping"

const CATEGORIES_TO_DISPLAY = ["start", "stop", "continue"]

export const GroupingBoard = props => {
  const { ideas, actions, userOptions } = props

  const [activeDraggable, setActiveDraggable] = useState(null)
  const [groups, setGroups] = useState([])
  const cardRefs = useRef({})

  const ideasSortedByBodyLengthAscending = orderBy(ideas, ["body.length", "id"], ["desc", "asc"])

  useEffect(() => {
    const newGroups = IdeaCardGrouping.findConnectedGroups(cardRefs.current)
    setGroups(newGroups)
  }, [ideas])

  useEffect(() => {
    const ideaGroupMap = new Map()

    groups.forEach(({ groupId, cardIds }) => {
      cardIds.forEach(cardId => ideaGroupMap.set(cardId, groupId))
    })

    ideas.forEach(({ id, temp_group_id: tempGroupId }) => {
      const newGroupId = ideaGroupMap.get(id) || null

      if (tempGroupId !== newGroupId) {
        actions.updateIdea(id, { temp_group_id: newGroupId })
      }
    })
  }, [groups, ideas, actions])

  const handleDragStart = ({ active }) => {
    setActiveDraggable(active.id)
  }

  const handleDragEnd = ({ active, delta }) => {
    const ideaId = active.id

    const currentIdea = ideas.find(idea => idea.id === ideaId)
    const currentX = currentIdea?.x ? currentIdea.x : 0
    const currentY = currentIdea?.y ? currentIdea.y : 0

    const updatedPosition = { id: ideaId, x: currentX + delta.x, y: currentY + delta.y }

    actions.ideaDraggedInGroupingStage(updatedPosition)
    actions.submitIdeaEditAsync(updatedPosition)

    setGroups(IdeaCardGrouping.findConnectedGroups(cardRefs.current))
    setActiveDraggable(null)
  }

  const eligibleDragAreaClassname = cx(styles.eligibleDragArea, "grouping-board")
  const sideGutterClassname = cx(styles.sideGutter, "ui inverted basic padded segment")
  const bottomGutterClassname = cx(styles.bottomGutter, "ui inverted basic segment")

  return (
    <React.Fragment>
      <div className={styles.boardAndSideGutterWrapper}>
        {/* Setup a11y */}
        {/* x - Figure out collsion detection */}
        {/* x - Groupings based off collision detection */}
        {/* Remove old stuff, including tests */}
        {/* Tests */}
        {/* x - Location of cards persists when nav off page */}
        {/* x - Styles */}
        {/* All users see the dragging cards and groupings live - not local state */}
        {/* Groupings not working on on non dragging screen. I believe this is happening because of local state vs. grouping on the server correctly.  */}
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
