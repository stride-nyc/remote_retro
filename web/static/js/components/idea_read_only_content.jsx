import React from "react"

import IdeaControls from "./idea_controls"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_read_only_content.css"

const IdeaReadOnlyContent = props => {
  const { idea, currentUser, retroChannel, stage, assignee } = props
  const isEdited = (+new Date(idea.updated_at) - +new Date(idea.inserted_at)) > 1000

  return (
    <div className={styles.ideaWrapper}>
      <IdeaControls
        idea={idea}
        retroChannel={retroChannel}
        currentUser={currentUser}
        stage={stage}
      />
      <span data-hj-masked>{ idea.body }</span>
      { isEdited && <span className={styles.editedIndicator}> (edited)</span> }
      { assignee && <span className={styles.assignee}> ({assignee.given_name})</span> }
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

export default IdeaReadOnlyContent
