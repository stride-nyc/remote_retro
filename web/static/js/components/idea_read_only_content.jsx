import React from "react"

import StageAwareIdeaControls from "./stage_aware_idea_controls"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_read_only_content.css"

const handleDragStart = props => event => {
  const { idea } = props
  event.dataTransfer.dropEffect = "move"
  // event dataTransfer only supports strings
  event.dataTransfer.setData("idea", JSON.stringify(idea))
}

const IdeaReadOnlyContent = props => {
  const { idea, currentUser, retroChannel, stage, assignee } = props
  const isEdited = (+new Date(idea.updated_at) - +new Date(idea.inserted_at)) > 1000
  const hasAssignee = Object.keys(assignee).length > 0

  const canUserEditIdea = currentUser.is_facilitator || (currentUser.id === idea.user_id)
  const isIdeaEditableInCurrentStage = stage === "idea-generation"

  return (
    <div
      className={styles.ideaWrapper}
      draggable={canUserEditIdea && isIdeaEditableInCurrentStage}
      onDragStart={handleDragStart(props)}
    >
      <StageAwareIdeaControls
        idea={idea}
        retroChannel={retroChannel}
        currentUser={currentUser}
        stage={stage}
      />
      <span data-hj-masked>{ idea.body }</span>
      {hasAssignee && <span className={styles.assignee}> ({assignee.name})</span>}
      {isEdited && <span className={styles.editedIndicator}> (edited)</span>}
    </div>
  )
}

IdeaReadOnlyContent.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
  assignee: AppPropTypes.presence,
}

IdeaReadOnlyContent.defaultProps = {
  assignee: {},
}

export default IdeaReadOnlyContent
