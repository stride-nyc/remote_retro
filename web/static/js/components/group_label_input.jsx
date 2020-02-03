import React, { Component } from "react"
import * as AppPropTypes from "../prop_types"

import styles from "./css_modules/group_label_input.css"

// This max length is presentational more than anything, ensuring it doesn't
// exceed the 1/4th column width on desktop, even with the widest possible characters
const MAX_LENGTH_OF_GROUP_NAME = 20

let showCheckMarkForLabelId = null

class GroupLabelInput extends Component {
  componentWillUpdate(nextProps) {
    const { groupWithAssociatedIdeasAndVotes } = this.props
    const oldLabel = groupWithAssociatedIdeasAndVotes.label
    const newLabel = nextProps.groupWithAssociatedIdeasAndVotes.label
    if (oldLabel !== newLabel) {
      showCheckMarkForLabelId = groupWithAssociatedIdeasAndVotes.id
    }
  }

  labelUpdatedCheckbox = () => {
    setTimeout(() => {
      showCheckMarkForLabelId = null
      this.forceUpdate()
    }, 2000)
    const classes = ["check icon"]
    classes.push(styles.fadeout)
    return <i className={classes.join(" ")} />
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
        <div className="ui">
          {showCheckMarkForLabelId === groupWithAssociatedIdeasAndVotes.id
            ? this.labelUpdatedCheckbox() : null
          }
        </div>
      </div>
    )
  }
}

GroupLabelInput.propTypes = {
  actions: AppPropTypes.actions.isRequired,
  groupWithAssociatedIdeasAndVotes: AppPropTypes.groupWithAssociatedIdeasAndVotes.isRequired,
}

export default GroupLabelInput
