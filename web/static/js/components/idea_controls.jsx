import React from "react"
import classNames from "classnames"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_controls.css"

const IdeaControls = props => {
  const { idea, retroChannel } = props
  const { id, isHighlighted = false } = idea
  const highlightClasses = classNames({
    [styles.actionIcon]: true,
    icon: true,
    announcement: !isHighlighted,
    ban: isHighlighted,
  })
  const highlightTitle = isHighlighted ? "De-Highlight Idea for Participants" : "Announce Idea to Channel"

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

IdeaControls.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
}

export default IdeaControls
