import React from "react"
import { connect } from "react-redux"
import { selectors } from "../redux/index"

import LowerThird from "./lower_third"
import IdeaGroup from "./idea_group"

import * as AppPropTypes from "../prop_types"

import styles from "./css_modules/groups_container.css"

export const GroupsContainer = props => {
  const { groupsWithAssociatedIdeasAndVotes, currentUser, actions } = props

  return (
    <div className={styles.wrapper}>
      <div className={styles.groupsWrapper}>
        {groupsWithAssociatedIdeasAndVotes.map(groupWithAssociatedIdeasAndVotes => (
          <IdeaGroup
            actions={actions}
            currentUser={currentUser}
            key={groupWithAssociatedIdeasAndVotes.id}
            groupWithAssociatedIdeasAndVotes={groupWithAssociatedIdeasAndVotes}
          />
        ))}
      </div>

      <LowerThird {...props} />
    </div>
  )
}

GroupsContainer.propTypes = {
  actions: AppPropTypes.actions.isRequired,
  currentUser: AppPropTypes.user.isRequired,
  groupsWithAssociatedIdeasAndVotes: AppPropTypes.groups.isRequired,
}

const mapStateToProps = state => ({
  groupsWithAssociatedIdeasAndVotes: selectors.groupsWithAssociatedIdeasAndVotes(state),
})

export default connect(mapStateToProps)(GroupsContainer)
