import React from "react"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_controls.css"

const IdeaControls = props => {
  const { idea, retroChannel } = props

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
        title="Announce Idea to Channel"
        className={`${styles.actionIcon} announcement icon`}
        onClick={() => { retroChannel.push("highlight_idea", idea.id) }}
      />
    </span>
  )
}

IdeaControls.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
}

export default IdeaControls
