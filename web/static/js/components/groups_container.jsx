import React, { Component } from "react"
import { connect } from "react-redux"
import orderBy from "lodash/orderBy"
import PropTypes from "prop-types"
import FlipMove from "react-flip-move"
import classNames from "classnames"

import { selectors } from "../redux/index"

import LowerThird from "./lower_third"
import IdeaGroup from "./idea_group"
import CategoryColumn from "./category_column"
import ContactStrideCTA from "./contact_stride_cta"
import OverflowDetector from "./overflow_detector"
import UserList from "./user_list"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/groups_container.css"

import STAGES from "../configs/stages"

const { GROUPS_LABELING, GROUPS_VOTING, GROUPS_CLOSED } = STAGES

const sortGroups = (groupsWithAssociatedIdeasAndVotes, isLabelingPlusVotingStage) => {
  return isLabelingPlusVotingStage
    ? orderBy(groupsWithAssociatedIdeasAndVotes, "id", "asc")
    : orderBy(groupsWithAssociatedIdeasAndVotes, ["votes.length", "id"], ["desc", "asc"])
}

export class GroupsContainer extends Component {
  state = {
    isGroupsListOverflowed: false,
  }

  handleOverflowChange = isGroupsListOverflowed => {
    this.setState({ isGroupsListOverflowed })
  }

  render() {
    const { isGroupsListOverflowed } = this.state
    const {
      alert,
      groupsWithAssociatedIdeasAndVotes,
      currentUser,
      actions,
      stage,
      currentUserHasExhaustedVotes,
    } = this.props

    const isLabelingOrVotingStage = [GROUPS_LABELING, GROUPS_VOTING].includes(stage)
    const hasAdvancedPastVotingStage = !isLabelingOrVotingStage
    const isRetroClosed = stage === GROUPS_CLOSED
    const shouldRenderCta = isRetroClosed && currentUser.locale === "en"
    const groupsSorted = sortGroups(groupsWithAssociatedIdeasAndVotes, isLabelingOrVotingStage)
    const groupsListClasses = classNames(styles.groupsWrapper, {
      overflowed: isGroupsListOverflowed,
    })

    return (
      <div className={styles.wrapper}>
        <div className={styles.flexContainerForGroupsAndOptionallyActionItems}>
          <OverflowDetector
            elementType="div"
            onOverflowChange={this.handleOverflowChange}
            interval={3000}
            className={groupsListClasses}
          >
            <FlipMove
              delay={500}
              duration={750}
              staggerDelayBy={100}
              easing="ease-out"
              enterAnimation="none"
              leaveAnimation="none"
              typeName={null}
            >
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
            </FlipMove>
          </OverflowDetector>

          {hasAdvancedPastVotingStage && (
            <CategoryColumn
              category="action-item"
              categoryDisplayStringOverride="Action Items"
              currentUser={currentUser}
              stage={stage}
            />
          )}

          {shouldRenderCta && <ContactStrideCTA alert={alert} currentUser={currentUser} />}
        </div>

        <UserList wrap={false} />

        <LowerThird {...this.props} />
      </div>
    )
  }
}

GroupsContainer.propTypes = {
  actions: AppPropTypes.actions.isRequired,
  currentUser: AppPropTypes.user.isRequired,
  currentUserHasExhaustedVotes: PropTypes.bool.isRequired,
  groupsWithAssociatedIdeasAndVotes: AppPropTypes.groups.isRequired,
  stage: AppPropTypes.stage.isRequired,
  alert: AppPropTypes.alert,
}

GroupsContainer.defaultProps = {
  alert: null,
}

const mapStateToProps = (state, { currentUser }) => ({
  alert: state.alert,
  groupsWithAssociatedIdeasAndVotes: selectors.groupsWithAssociatedIdeasAndVotes(state),
  currentUserHasExhaustedVotes: selectors.currentUserHasExhaustedVotes(state, currentUser),
})

export default connect(mapStateToProps)(GroupsContainer)
