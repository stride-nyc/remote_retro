import React from "react"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_controls.css"

function IdeaControls(props) {
  const { handleDelete, idea, handleEnableEditState } = props

  return (
    <span>
      <i
        id={idea.id}
        title="Delete Idea"
        className={styles.actionIcon + ` remove circle icon`}
        onClick={handleDelete}
      >
      </i>
      <i
        title="Edit Idea"
        className={styles.actionIcon + ` edit icon`}
        onClick={handleEnableEditState}
      >
      </i>
    </span>
  )
}

IdeaControls.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  handleDelete: React.PropTypes.func.isRequired,
}

export default IdeaControls
