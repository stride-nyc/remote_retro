import React from "react"
import * as AppPropTypes from "../prop_types"

import GroupLabelInput from "./group_label_input"
import styles from "./css_modules/group_label_container.css"

const GroupLabelContainer = ({ groupWithAssociatedIdeasAndVotes, currentUser, actions }) => (
  <div className={styles.wrapper}>
    {currentUser.is_facilitator ? (
      <GroupLabelInput
        actions={actions}
        groupWithAssociatedIdeasAndVotes={groupWithAssociatedIdeasAndVotes}
      />
    ) : (
      <p className="readonly-group-label">{groupWithAssociatedIdeasAndVotes.label}</p>
    )}
  </div>
)

GroupLabelContainer.propTypes = {
  actions: AppPropTypes.actions.isRequired,
  currentUser: AppPropTypes.user.isRequired,
  groupWithAssociatedIdeasAndVotes: AppPropTypes.groupWithAssociatedIdeasAndVotes.isRequired,
}

export default GroupLabelContainer
