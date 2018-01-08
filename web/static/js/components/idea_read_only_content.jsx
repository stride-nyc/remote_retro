import React from "react"

import IdeaControls from "./idea_controls"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_read_only_content.css"

const handleDragStart = props => event => {
  const { idea } = props
  event.dataTransfer.dropEffect = "move"
  event.dataTransfer.setData("ideaId", idea.id)
  event.dataTransfer.setData("ideaBody", idea.body)
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
      <IdeaControls
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
  currentUser: AppPropTypes.user.isRequired,
  stage: AppPropTypes.stage.isRequired,
  assignee: AppPropTypes.user,
}

IdeaReadOnlyContent.defaultProps = {
  assignee: {},
}

export default IdeaReadOnlyContent
