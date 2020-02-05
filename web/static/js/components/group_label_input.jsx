import React, { Component } from "react"
import * as AppPropTypes from "../prop_types"

import styles from "./css_modules/group_label_input.css"

// This max length is presentational more than anything, ensuring it doesn't
// exceed the 1/4th column width on desktop, even with the widest possible characters
const MAX_LENGTH_OF_GROUP_NAME = 20

class GroupLabelInput extends Component {
  state = (() => {
    const { groupWithAssociatedIdeasAndVotes } = this.props
    const { label } = groupWithAssociatedIdeasAndVotes
    return {
      oldLabel: label,
      showCheckmarkForLabelId: null,
    }
  })();

  static getDerivedStateFromProps(props, state) {
    const { oldLabel } = state
    const { groupWithAssociatedIdeasAndVotes } = props
    const newLabel = groupWithAssociatedIdeasAndVotes.label
    if (oldLabel !== newLabel) {
      return ({
        oldLabel: newLabel,
        showCheckmarkForLabelId: groupWithAssociatedIdeasAndVotes.id })
    }
    return null
  }

  labelUpdatedCheckmark = () => {
    const classes = ["check icon"]
    classes.push(styles.updateSucceededCheckmark)
    setTimeout(() => {
      this.setState({ showCheckmarkForLabelId: null })
    }, 2000)
    return <div className="ui"><i className={classes.join(" ")} /></div>
  }

  render() {
    const { groupWithAssociatedIdeasAndVotes, actions } = this.props
    const { showCheckmarkForLabelId } = this.state

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
        {showCheckmarkForLabelId === groupWithAssociatedIdeasAndVotes.id
          ? this.labelUpdatedCheckmark() : null
        }
      </div>
    )
  }
}

GroupLabelInput.propTypes = {
  actions: AppPropTypes.actions.isRequired,
  groupWithAssociatedIdeasAndVotes: AppPropTypes.groupWithAssociatedIdeasAndVotes.isRequired,
}

export default GroupLabelInput
