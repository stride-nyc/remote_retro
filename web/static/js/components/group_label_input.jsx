import React, { Component } from "react"
import * as AppPropTypes from "../prop_types"

import styles from "./css_modules/group_label_input.css"

// This max length is presentational more than anything, ensuring it doesn't
// exceed the 1/4th column width on desktop, even with the widest possible characters
const MAX_LENGTH_OF_GROUP_NAME = 20

let labelChangedId = null

class GroupLabelInput extends Component {
  componentWillUpdate(prevProps) {
    const { groupWithAssociatedIdeasAndVotes } = this.props
    const oldLabel = prevProps.groupWithAssociatedIdeasAndVotes.label
    const newLabel = groupWithAssociatedIdeasAndVotes.label
    if (oldLabel !== newLabel) {
      console.log("[GroupLabelInput]: label changed")
      labelChangedId = groupWithAssociatedIdeasAndVotes.id
    }
  }

  render() {
    const { groupWithAssociatedIdeasAndVotes, actions } = this.props

    return (
      <div className="ui fluid input">
        <input
          type="text"
          className={styles.textInput}
          placeholder="Add a group label"
          defaultValue={groupWithAssociatedIdeasAndVotes.label}
          maxLength={MAX_LENGTH_OF_GROUP_NAME}
          onBlur={e => {
            actions.submitGroupLabelChanges(groupWithAssociatedIdeasAndVotes, e.target.value)
          }}
        />
        <div className="instruction">
          <span className="keyboard-key">tab</span> to submit
        </div>
        {labelChangedId === groupWithAssociatedIdeasAndVotes.id ? <i className="check icon" /> : null}
      </div>
    )
  }
}

GroupLabelInput.propTypes = {
  actions: AppPropTypes.actions.isRequired,
  groupWithAssociatedIdeasAndVotes: AppPropTypes.groupWithAssociatedIdeasAndVotes.isRequired,
}

export default GroupLabelInput
