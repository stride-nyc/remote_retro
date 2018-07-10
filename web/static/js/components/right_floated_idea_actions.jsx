import React from "react"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/right_floated_idea_actions.css"

const RightFloatedIdeaActions = props => {
  const { idea, retroChannel, currentUser } = props
  const { id, isHighlighted = false } = idea

  const highlightTitle = isHighlighted ? "De-Highlight Idea for Participants" : "Announce Idea to Channel"

  return (
    <span className={`${styles.wrapper} ${idea.editing ? "disabled" : ""}`}>
      {
        currentUser.is_facilitator &&
        <i
          title={highlightTitle}
          className={`${!isHighlighted ? "announcement" : "ban"} icon`}
          onClick={() => { retroChannel.push("highlight_idea", { id, isHighlighted }) }}
        />
      }
      <i
        title="Edit Idea"
        className="edit icon"
        onClick={() => { retroChannel.push("enable_idea_edit_state", { id: idea.id, editorToken: currentUser.token }) }}
      />
      <i
        title="Delete Idea"
        className="remove circle icon"
        onClick={() => { retroChannel.push("idea_deleted", idea.id) }}
      />
    </span>
  )
}

RightFloatedIdeaActions.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
}

export default RightFloatedIdeaActions
