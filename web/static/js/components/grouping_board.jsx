import React, { useState, useEffect, useRef } from "react"
import { DndContext } from "@dnd-kit/core"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import orderBy from "lodash/orderBy"
import PropTypes from "prop-types"
import cx from "classnames"

import * as AppPropTypes from "../prop_types"
import IdeaCardGrouping from "../services/idea_card_grouping"

import GroupingCard from "./grouping_card"
import styles from "./css_modules/grouping_board.css"

export const GroupingBoard = props => {
  // const { ideas, actions, userOptions, currentUser } = props
  // TEMP
  const { ideas, actions, userOptions } = props
  const [currentUser, setCurrentUser] = useState()
  useEffect(() => {
    setCurrentUser({ id: Math.floor(Math.random() * 100) + 1 })
  }, [])
  // END EMP

  const [activeDraggable, setActiveDraggable] = useState(null)
  const [groups, setGroups] = useState([])

  const cardRefs = useRef({})

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

    actions.updateIdea(active.id, { dragging_user_id: currentUser.id })
    actions.broadcastIdeaDragStateChange(active.id, currentUser.id)
  }

  const handleDragMove = ({ active, delta }) => {
    const currentIdea = ideas.find(idea => idea.id === active.id)
    // if (currentIdea.dragging_user_id === currentUser.id) return

    const currentX = currentIdea?.x ? currentIdea.x : 0
    const currentY = currentIdea?.y ? currentIdea.y : 0

    const updatedPosition = { id: active.id, x: currentX + delta.x, y: currentY + delta.y }
    console.log("updated x", updatedPosition.x)

    // actions.ideaDraggedInGroupingStage(updatedPosition)
    // actions.submitIdeaEditAsync(updatedPosition)
  }

  const handleDragEnd = ({ active, delta }) => {
    const currentIdea = ideas.find(idea => idea.id === active.id)
    const currentX = currentIdea?.x ? currentIdea.x : 0
    const currentY = currentIdea?.y ? currentIdea.y : 0

    const updatedPosition = { id: active.id, x: currentX + delta.x, y: currentY + delta.y }

    actions.ideaDraggedInGroupingStage(updatedPosition)
    actions.submitIdeaEditAsync(updatedPosition)

    setGroups(IdeaCardGrouping.findConnectedGroups(cardRefs.current))
    setActiveDraggable(null)

    actions.updateIdea(active.id, { dragging_user_id: null })
    actions.broadcastIdeaDragStateChange(active.id, null)
  }

  const ideasSortedByBodyLengthAscending = orderBy(ideas, ["body.length", "id"], ["desc", "asc"])

  const eligibleDragAreaClassname = cx(styles.eligibleDragArea, "grouping-board")
  const sideGutterClassname = cx(styles.sideGutter, "ui inverted basic padded segment")
  const bottomGutterClassname = cx(styles.bottomGutter, "ui inverted basic segment")

  return (
    <React.Fragment>
      <div className={styles.boardAndSideGutterWrapper}>
        <DndContext
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement]}
        >
          <div className={eligibleDragAreaClassname}>
            {ideasSortedByBodyLengthAscending.map(idea => {
              const { id, body } = idea
              const group = groups.find(group => group.cardIds.includes(id))
              const groupId = group ? group.groupId : null

              return (
                <GroupingCard
                  key={id}
                  idea={idea}
                  isActive={activeDraggable === id}
                  currentUser={currentUser}
                  groupId={groupId}
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
