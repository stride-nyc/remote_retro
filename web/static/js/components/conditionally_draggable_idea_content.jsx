import React from "react"
import MediaQuery from "react-responsive"

import StageAwareIdeaControls from "./stage_aware_idea_controls"

import * as AppPropTypes from "../prop_types"
import { MIN_TABLET_WIDTH } from "../configs/responsive"
import styles from "./css_modules/conditionally_draggable_idea_content.css"

const handleDragStart = props => event => {
  const { idea } = props
  event.dataTransfer.dropEffect = "move"
  // event dataTransfer only supports strings
  event.dataTransfer.setData("idea", JSON.stringify(idea))
}

const ConditionallyDraggableIdeaContent = props => {
  const { idea, currentUser, retroChannel, stage, assignee } = props
  const isEdited = (+new Date(idea.updated_at) - +new Date(idea.inserted_at)) > 100

  const canUserEditIdea = currentUser.is_facilitator || (currentUser.id === idea.user_id)
  const isIdeaEditableInCurrentStage = stage === "idea-generation"

  return (
    <MediaQuery minWidth={MIN_TABLET_WIDTH}>
      {isTabletOrAbove => (
        <div
          className={styles.ideaWrapper}
          draggable={canUserEditIdea && isIdeaEditableInCurrentStage && isTabletOrAbove}
          onDragStart={handleDragStart(props)}
        >
          <StageAwareIdeaControls
            idea={idea}
            retroChannel={retroChannel}
            currentUser={currentUser}
            stage={stage}
          />
          <div className="text">
            <span data-hj-masked>{ idea.body }</span>
            {assignee && <span className={styles.assignee}> ({assignee.name})</span>}
            {isEdited && <span className={styles.editedIndicator}> (edited)</span>}
          </div>
        </div>
      )}
    </MediaQuery>
  )
}

ConditionallyDraggableIdeaContent.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
  assignee: AppPropTypes.presence,
}

ConditionallyDraggableIdeaContent.defaultProps = {
  assignee: null,
}

export default ConditionallyDraggableIdeaContent
