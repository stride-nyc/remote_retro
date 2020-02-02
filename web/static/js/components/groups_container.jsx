import React from "react"
import { connect } from "react-redux"
import orderBy from "lodash/orderBy"
import PropTypes from "prop-types"

import { selectors } from "../redux/index"

import LowerThird from "./lower_third"
import IdeaGroup from "./idea_group"
import CategoryColumn from "./category_column"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/groups_container.css"

import STAGES from "../configs/stages"

const { LABELING_PLUS_VOTING } = STAGES

const sortGroups = (groupsWithAssociatedIdeasAndVotes, isLabelingPlusVotingStage) => {
  return isLabelingPlusVotingStage
    ? orderBy(groupsWithAssociatedIdeasAndVotes, "id", "asc")
    : orderBy(groupsWithAssociatedIdeasAndVotes, ["votes.length", "id"], ["desc", "asc"])
}

export const GroupsContainer = props => {
  const {
    groupsWithAssociatedIdeasAndVotes,
    currentUser,
    actions,
    stage,
    currentUserHasExhaustedVotes,
  } = props

  const isLabelingPlusVotingStage = stage === LABELING_PLUS_VOTING
  const groupsSorted = sortGroups(groupsWithAssociatedIdeasAndVotes, isLabelingPlusVotingStage)

  return (
    <div className={styles.wrapper}>
      <div className={styles.flexContainerForGroupsAndOptionallyActionItems}>
        <div className={styles.groupsWrapper}>
          {groupsSorted.map(groupWithAssociatedIdeasAndVotes => (
            <IdeaGroup
              actions={actions}
              currentUser={currentUser}
              currentUserHasExhaustedVotes={currentUserHasExhaustedVotes}
              key={groupWithAssociatedIdeasAndVotes.id}
              stage={stage}
              groupWithAssociatedIdeasAndVotes={groupWithAssociatedIdeasAndVotes}
            />
          ))}
        </div>

        {!isLabelingPlusVotingStage && (
          <CategoryColumn
            category="action-item"
            currentUser={currentUser}
            stage={stage}
          />
        )}
      </div>

      <LowerThird {...props} />
    </div>
  )
}

GroupsContainer.propTypes = {
  actions: AppPropTypes.actions.isRequired,
  currentUser: AppPropTypes.user.isRequired,
  currentUserHasExhaustedVotes: PropTypes.bool.isRequired,
  groupsWithAssociatedIdeasAndVotes: AppPropTypes.groups.isRequired,
  stage: AppPropTypes.stage.isRequired,
}

const mapStateToProps = (state, { currentUser }) => ({
  groupsWithAssociatedIdeasAndVotes: selectors.groupsWithAssociatedIdeasAndVotes(state),
  currentUserHasExhaustedVotes: selectors.currentUserHasExhaustedVotes(state, currentUser),
})

export default connect(mapStateToProps)(GroupsContainer)
