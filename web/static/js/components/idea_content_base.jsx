import React from "react"
import PropTypes from "prop-types"

import StageAwareIdeaControls from "./stage_aware_idea_controls"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/conditionally_draggable_idea_content.css"

const IdeaContentBase = props => {
  const {
    idea,
    currentUser,
    stage,
    assignee,
    canUserEditIdeaContents,
  } = props

  const isEdited = (+new Date(idea.updated_at) > +new Date(idea.inserted_at))

  return (
    <div className={styles.ideaWrapper}>
      <StageAwareIdeaControls
        idea={idea}
        currentUser={currentUser}
        stage={stage}
        canUserEditIdeaContents={canUserEditIdeaContents}
      />
      <div className="text">
        <span>{ idea.body }</span>
        {assignee && <span className={styles.assignee}> ({assignee.name})</span>}
        {isEdited && <span className={styles.editedIndicator}> (edited)</span>}
      </div>
    </div>
  )
}

IdeaContentBase.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
  assignee: AppPropTypes.presence,
  canUserEditIdeaContents: PropTypes.bool.isRequired,
}

IdeaContentBase.defaultProps = {
  assignee: null,
}

export default IdeaContentBase
