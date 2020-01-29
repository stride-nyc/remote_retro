import React from "react"
import * as AppPropTypes from "../prop_types"

import GroupLabelInput from "./group_label_input"

const GroupLabelContainer = ({ groupWithAssociatedIdeasAndVotes, currentUser, actions }) => (
  <React.Fragment>
    {currentUser.is_facilitator ? (
      <GroupLabelInput
        actions={actions}
        groupWithAssociatedIdeasAndVotes={groupWithAssociatedIdeasAndVotes}
      />
    ) : (
      <p className="readonly-group-label">{groupWithAssociatedIdeasAndVotes.label}</p>
    )}
  </React.Fragment>
)

GroupLabelContainer.propTypes = {
  actions: AppPropTypes.actions.isRequired,
  currentUser: AppPropTypes.user.isRequired,
  groupWithAssociatedIdeasAndVotes: AppPropTypes.groupWithAssociatedIdeasAndVotes.isRequired,
}

export default GroupLabelContainer
