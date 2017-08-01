import React from "react"
import classNames from "classnames"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_controls.css"

const timeElapsedLessThanFiveSec = ideaCreationTimestamp => {
  const millisecondsSinceIdeaCreation = new Date(ideaCreationTimestamp)
  const timeElapsedSinceIdeaCreation = new Date().getTime() - millisecondsSinceIdeaCreation
  return (timeElapsedSinceIdeaCreation < 5000)
}

const IdeaControls = props => {
  const { idea, retroChannel, currentUser } = props
  const { id, user_id: userId, isHighlighted = false } = idea
  const highlightClasses = classNames({
    [styles.actionIcon]: true,
    icon: true,
    announcement: !isHighlighted,
    ban: isHighlighted,
  })
  const highlightTitle = isHighlighted ? "De-Highlight Idea for Participants" : "Announce Idea to Channel"

  function renderIcons() {
    if (currentUser.is_facilitator) {
      return (
        <span>
          <i
            title="Delete Idea"
            className={`${styles.actionIcon} remove circle icon`}
            onClick={() => { retroChannel.push("delete_idea", idea.id) }}
          />
          <i
            title="Edit Idea"
            className={`${styles.actionIcon} edit icon`}
            onClick={() => { retroChannel.push("enable_edit_state", idea) }}
          />
          <i
            title={highlightTitle}
            className={highlightClasses}
            onClick={() => { retroChannel.push("highlight_idea", { id, isHighlighted }) }}
          />
        </span>
      )
    }

    if (currentUser.id === userId && timeElapsedLessThanFiveSec(idea.inserted_at)) {
      return (
        <i
          title="Delete Idea"
          className={`${styles.actionIcon} ${styles.disappearingIcon} remove circle icon`}
          onClick={() => { retroChannel.push("delete_idea", idea.id) }}
        />
      )
    }
    return null
  }

  return renderIcons()
}

IdeaControls.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentUser: AppPropTypes.user.isRequired,
}

export default IdeaControls
