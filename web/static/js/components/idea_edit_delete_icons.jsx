import React from "react"
import classNames from "classnames"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_edit_delete_icons.css"

const IdeaEditDeleteIcons = props => {
  const { idea, actions } = props

  const disabled = idea.inEditState || idea.deletionSubmitted
  const classes = classNames(styles.wrapper, {
    disabled,
  })

  const handleDelete = () => {
    const confirmed = confirm("Are you sure you want to delete this idea?")
    if (confirmed) {
      actions.submitIdeaDeletionAsync(idea.id)
    }
  }

  const handleInitiateEdit = () => { actions.initiateIdeaEditState(idea.id) }

  return (
    <span className={classes}>
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

IdeaEditDeleteIcons.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  actions: AppPropTypes.actions.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
}

export default IdeaEditDeleteIcons
