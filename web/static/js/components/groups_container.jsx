import React from "react"
import { connect } from "react-redux"
import orderBy from "lodash/orderBy"

import { selectors } from "../redux/index"

import LowerThird from "./lower_third"
import IdeaGroup from "./idea_group"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/groups_container.css"

import STAGES from "../configs/stages"

const { LABELING_PLUS_VOTING } = STAGES

const sortGroups = (groupsWithAssociatedIdeasAndVotes, stage) => {
  return stage === LABELING_PLUS_VOTING
    ? orderBy(groupsWithAssociatedIdeasAndVotes, "id", "asc")
    : orderBy(groupsWithAssociatedIdeasAndVotes, ["votes.length", "id"], ["desc", "asc"])
}

export const GroupsContainer = props => {
  const { groupsWithAssociatedIdeasAndVotes, currentUser, actions, stage } = props
  const groupsSorted = sortGroups(groupsWithAssociatedIdeasAndVotes, stage)

  return (
    <div className={styles.wrapper}>
      <div className={styles.groupsWrapper}>
        {groupsSorted.map(groupWithAssociatedIdeasAndVotes => (
          <IdeaGroup
            actions={actions}
            currentUser={currentUser}
            key={groupWithAssociatedIdeasAndVotes.id}
            stage={stage}
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
  stage: AppPropTypes.stage.isRequired,
}

const mapStateToProps = state => ({
  groupsWithAssociatedIdeasAndVotes: selectors.groupsWithAssociatedIdeasAndVotes(state),
})

export default connect(mapStateToProps)(GroupsContainer)
