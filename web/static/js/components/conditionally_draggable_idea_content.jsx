import React from "react"
import PropTypes from "prop-types"

import StageAwareIdeaControls from "./stage_aware_idea_controls"

import * as AppPropTypes from "../prop_types"
import STAGES from "../configs/stages"
import styles from "./css_modules/conditionally_draggable_idea_content.css"

const { IDEA_GENERATION, GROUPING } = STAGES

const handleDragStart = props => event => {
  const { idea } = props
  event.dataTransfer.dropEffect = "move"
  // event dataTransfer only supports strings
  event.dataTransfer.setData("idea", JSON.stringify(idea))
}

const ConditionallyDraggableIdeaContent = props => {
  const {
    idea,
    currentUser,
    retroChannel,
    stage,
    assignee,
    canUserEditIdeaContents,
    isTabletOrAbove,
  } = props

  const isEdited = (+new Date(idea.updated_at) - +new Date(idea.inserted_at)) > 100
  const isGrouping = stage === GROUPING
  const isIdeaGeneration = stage === IDEA_GENERATION

  const isIdeaDragEligible = (isGrouping || (isIdeaGeneration && canUserEditIdeaContents))

  return (
    <div
      className={styles.ideaWrapper}
      draggable={isIdeaDragEligible && isTabletOrAbove}
      onDragStart={handleDragStart(props)}
    >
      <StageAwareIdeaControls
        idea={idea}
        retroChannel={retroChannel}
        currentUser={currentUser}
        stage={stage}
        canUserEditIdeaContents={canUserEditIdeaContents}
      />
      <div className="text">
        <span data-hj-masked>{ idea.body }</span>
        {assignee && <span className={styles.assignee}> ({assignee.name})</span>}
        {isEdited && <span className={styles.editedIndicator}> (edited)</span>}
      </div>
    </div>
  )
}

ConditionallyDraggableIdeaContent.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
  assignee: AppPropTypes.presence,
  canUserEditIdeaContents: PropTypes.bool.isRequired,
  isTabletOrAbove: PropTypes.bool.isRequired,
}

ConditionallyDraggableIdeaContent.defaultProps = {
  assignee: null,
}

export default ConditionallyDraggableIdeaContent
