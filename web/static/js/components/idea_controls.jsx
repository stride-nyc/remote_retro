import React, { PropTypes } from "react"
import classNames from "classnames"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_controls.css"
import VoteCounter from "./vote_counter"

const timeElapsedLessThanFiveSec = ideaCreationTimestamp => {
  const millisecondsSinceIdeaCreation = new Date(ideaCreationTimestamp)
  const timeElapsedSinceIdeaCreation = new Date().getTime() - millisecondsSinceIdeaCreation
  return (timeElapsedSinceIdeaCreation < 5000)
}

const IdeaControls = props => {
  const { idea, retroChannel, currentUser, stage } = props
  const { id, user_id: userId, isHighlighted = false, category } = idea
  const highlightClasses = classNames({
    [styles.actionIcon]: true,
    icon: true,
    announcement: !isHighlighted,
    ban: isHighlighted,
  })
  const highlightTitle = isHighlighted ? "De-Highlight Idea for Participants" : "Announce Idea to Channel"

  function renderIcons() {
    if (stage !== "idea-generation" && category !== "action-item") {
      return (
        <VoteCounter
          retroChannel={retroChannel}
          idea={idea}
          buttonDisabled={stage !== "voting"}
          currentUser={currentUser}
        />
      )
    }
    if (currentUser.is_facilitator) {
      return (
        <div className={styles.wrapper}>
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
        </div>
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
  stage: PropTypes.string.isRequired,
}

export default IdeaControls
