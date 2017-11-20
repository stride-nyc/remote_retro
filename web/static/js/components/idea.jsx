import React from "react"
import classNames from "classnames"

import IdeaControls from "./idea_controls"
import IdeaEditForm from "./idea_edit_form"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea.css"
import STAGES from "../configs/stages"

const { CLOSED } = STAGES

const Idea = props => {
  const { idea, currentUser, retroChannel, stage } = props
  const isFacilitator = currentUser.is_facilitator
  const isEdited = (+new Date(idea.updated_at) - +new Date(idea.inserted_at)) > 1000
  const classes = classNames({
    [styles.index]: true,
    "ui raised segment": idea.editing,
    [styles.highlighted]: idea.isHighlighted,
  })

  const ideaControls = (
    <IdeaControls
      idea={idea}
      retroChannel={retroChannel}
      currentUser={currentUser}
      stage={stage}
    />
  )

  const editingMessage = (
    <p className="ui center aligned sub dividing header">Facilitator is Editing</p>
  )

  const ideaEditForm = (
    <IdeaEditForm idea={idea} retroChannel={retroChannel} />
  )

  const renderIdeaControls = () => {
    if (stage !== CLOSED) {
      return ideaControls
    }
    return null
  }

  const renderMessage = () => {
    if (idea.editing && !isFacilitator) {
      return editingMessage
    }
    return null
  }

  const renderText = () => (
    idea.liveEditText || idea.body
  )

  const renderEditedIndicator = () => (
    isEdited && <span className={styles.editedIndicator}> (edited)</span>
  )

  const readOnlyIdea = (
    <div className={styles.ideaWrapper}>
      { renderIdeaControls() }
      { renderMessage() }
      <span data-hj-masked>{ renderText() }</span>
      { renderEditedIndicator() }
    </div>
  )

  const shouldAppearEditable = idea.editing && isFacilitator

  return (
    <li className={classes} title={idea.body} key={idea.id}>
      { shouldAppearEditable ? ideaEditForm : readOnlyIdea }
    </li>
  )
}

Idea.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentUser: AppPropTypes.user.isRequired,
  stage: AppPropTypes.stage.isRequired,
}

export default Idea
