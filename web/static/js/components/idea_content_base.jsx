import React from "react"
import PropTypes from "prop-types"

import StageAwareIdeaControls from "./stage_aware_idea_controls"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/conditionally_draggable_idea_content.css"

const IdeaContentBase = props => {
  const {
    idea,
    currentUser,
    retroChannel,
    stage,
    assignee,
    canUserEditIdeaContents,
    draggable,
    onDragStart,
  } = props

  const isEdited = (+new Date(idea.updated_at) - +new Date(idea.inserted_at)) > 100

  return (
    <div
      className={styles.ideaWrapper}
      draggable={draggable}
      onDragStart={onDragStart}
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

IdeaContentBase.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
  assignee: AppPropTypes.presence,
  canUserEditIdeaContents: PropTypes.bool.isRequired,
  draggable: PropTypes.bool.isRequired,
  onDragStart: PropTypes.func,
}

IdeaContentBase.defaultProps = {
  assignee: null,
  onDragStart: () => {},
}

export default IdeaContentBase
