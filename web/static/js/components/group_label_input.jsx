import React, { Component } from "react"
import * as AppPropTypes from "../prop_types"

import SuccessCheckmark from "./success_checkmark"
import styles from "./css_modules/group_label_input.css"

// This max length is presentational more than anything, ensuring it doesn't
// exceed the 1/4th column width on desktop, even with the widest possible characters
const MAX_LENGTH_OF_GROUP_NAME = 20

class GroupLabelInput extends Component {
  constructor(props) {
    super(props)
    const { groupWithAssociatedIdeasAndVotes: { label } } = props

    this.state = {
      memoizedLabel: label,
      groupLabelInputValue: label,
      persistedLabelHasChanged: false,
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { memoizedLabel } = state
    const { groupWithAssociatedIdeasAndVotes } = props
    const newLabel = groupWithAssociatedIdeasAndVotes.label

    if (memoizedLabel !== newLabel) {
      return ({
        memoizedLabel: newLabel,
        persistedLabelHasChanged: true,
      })
    }

    return null
  }

  handleChange = ({ target }) => {
    const { actions, groupWithAssociatedIdeasAndVotes } = this.props

    this.setState({ groupLabelInputValue: target.value }, () => {
      const { groupLabelInputValue } = this.state

      actions.submitGroupLabelChanges(groupWithAssociatedIdeasAndVotes, groupLabelInputValue)
    })
  }

  shouldShowCheckmark = () => {
    const { groupWithAssociatedIdeasAndVotes } = this.props
    const { persistedLabelHasChanged, groupLabelInputValue } = this.state
    const persistedLabelValue = groupWithAssociatedIdeasAndVotes.label

    const inputValueMatchesPersistedValue = groupLabelInputValue === persistedLabelValue

    return persistedLabelHasChanged && inputValueMatchesPersistedValue
  }

  render() {
    const { groupLabelInputValue } = this.state

    return (
      <div className="ui fluid input">
        <input
          type="text"
          className={styles.textInput}
          placeholder="(optional) Group Label"
          value={groupLabelInputValue}
          maxLength={MAX_LENGTH_OF_GROUP_NAME}
          onChange={this.handleChange}
        />

        {this.shouldShowCheckmark() && (
          <SuccessCheckmark
            cssModifier={styles.updateSucceededCheckmark}
          />
        )}
      </div>
    )
  }
}

GroupLabelInput.propTypes = {
  actions: AppPropTypes.actions.isRequired,
  groupWithAssociatedIdeasAndVotes: AppPropTypes.groupWithAssociatedIdeasAndVotes.isRequired,
}

export default GroupLabelInput
