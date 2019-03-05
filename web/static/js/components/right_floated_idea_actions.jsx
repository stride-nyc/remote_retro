import React from "react"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/right_floated_idea_actions.css"

const RightFloatedIdeaActions = props => {
  const { idea, actions } = props

  const disabled = idea.inEditState || idea.deletionSubmitted

  const handleDelete = () => {
    const confirmed = confirm("Are you sure you want to delete this idea?")
    if (confirmed) {
      actions.submitIdeaDeletionAsync(idea.id)
    }
  }

  const handleInitiateEdit = () => { actions.initiateIdeaEditState(idea.id) }

  return (
    <span className={`${styles.wrapper} ${disabled ? "disabled" : ""}`}>
      <i
        title="Edit Idea"
        className="edit icon"
        onClick={handleInitiateEdit}
        onKeyPress={handleInitiateEdit}
      />
      <i
        title="Delete Idea"
        className="remove circle icon"
        onClick={handleDelete}
        onKeyPress={handleDelete}
      />
    </span>
  )
}

RightFloatedIdeaActions.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  actions: AppPropTypes.actions.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
}

export default RightFloatedIdeaActions
