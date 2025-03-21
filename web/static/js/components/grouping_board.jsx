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
  const { ideas, actions, userOptions, currentUser } = props

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

    // This is in place to prevent the user from dragging a card that is already being dragged by another user
    // If we want to get rid of this approach we will want to remove the dragging_user_id from the model, remove all instances of it in the code,
    // and also remove our use of currentUser in the GroupingStage component, here, and in the GroupingCard component
    actions.updateIdea(active.id, { dragging_user_id: currentUser.id })
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

    actions.updateIdea(active.id, { dragging_user_id: null })
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
        {/* NICE TO HAVE: All users see the dragging cards and groupings live - not local state */}
        {/* need to test - disable card when dragged by another user until drag stops */}
        {/* x- Groupings not working on on non dragging screen. */}
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement]}
        >
          <div className={eligibleDragAreaClassname}>
            {ideasSortedByBodyLengthAscending.map(idea => {
              const { id, body, category, x = 0, y = 0, dragging_user_id: draggingUserId } = idea
              const group = groups.find(group => group.cardIds.includes(id))
              const groupId = group ? group.groupId : null

              return (
                <GroupingCard
                  key={id}
                  id={id}
                  top={y}
                  left={x}
                  isActive={activeDraggable === id}
                  draggingUserId={draggingUserId}
                  currentUser={currentUser}
                  groupId={groupId}
                  category={category}
                  userOptions={userOptions}
                  actions={actions}
                  ref={el => {
                    cardRefs.current[id] = el
                  }}
                >
                  <span>{body}</span>
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
  actions: PropTypes.object.isRequired,
  userOptions: AppPropTypes.userOptions.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
}

export default GroupingBoard
