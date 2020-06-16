import React, { Component } from "react"
import PropTypes from "prop-types"
import cx from "classnames"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_group.css"
import ideaStyles from "./css_modules/idea.css"
import GroupLabelContainer from "./group_label_container"
import VotingInterface from "./voting_interface"
import OverflowDetector from "./overflow_detector"

import STAGES from "../configs/stages"

const { LABELING_PLUS_VOTING } = STAGES

const CATEGORY_ICON_HEIGHT_WIDTH = 18

class IdeaGroup extends Component {
  state = {
    listIsOverflowed: false,
  }

  handleListOverflowChange = listIsOverflowed => {
    this.setState({ listIsOverflowed })
  }

  render() {
    const { listIsOverflowed } = this.state

    const {
      groupWithAssociatedIdeasAndVotes,
      currentUser,
      actions,
      stage,
      currentUserHasExhaustedVotes,
    } = this.props

    const ideaToCastVoteFor = groupWithAssociatedIdeasAndVotes.ideas[0]
    const isVotingStage = stage === LABELING_PLUS_VOTING
    const listContainerClasses = cx("list-container", { overflowed: listIsOverflowed })

    return (
      <div className={`idea-group ${styles.wrapper}`}>
        <GroupLabelContainer
          actions={actions}
          currentUser={currentUser}
          groupWithAssociatedIdeasAndVotes={groupWithAssociatedIdeasAndVotes}
          stage={stage}
        />

        <div className={styles.centeredVotingWrapper}>
          <div className="ui right pointing teal label">
            Vote!
          </div>

          <VotingInterface
            actions={actions}
            currentUser={currentUser}
            currentUserHasExhaustedVotes={currentUserHasExhaustedVotes}
            isVotingStage={isVotingStage}
            ideaToCastVoteFor={ideaToCastVoteFor}
            votesForEntity={groupWithAssociatedIdeasAndVotes.votes}
          />
        </div>

        <OverflowDetector
          className={listContainerClasses}
          elementType="div"
          interval={3000}
          onOverflowChange={this.handleListOverflowChange}
        >
          <ul className={styles.list}>
            {groupWithAssociatedIdeasAndVotes.ideas.map(idea => {
              return (
                <li
                  key={idea.id}
                  className={ideaStyles.index}
                >
                  <div className={styles.categoryImgWrapper}>
                    <img
                      src={`/images/${idea.category}.svg`}
                      height={CATEGORY_ICON_HEIGHT_WIDTH}
                      width={CATEGORY_ICON_HEIGHT_WIDTH}
                      alt={idea.category}
                    />
                  </div>

                  {idea.body}
                </li>
              )
            })}
          </ul>
        </OverflowDetector>
      </div>
    )
  }
}

IdeaGroup.propTypes = {
  actions: AppPropTypes.actions.isRequired,
  currentUser: AppPropTypes.user.isRequired,
  currentUserHasExhaustedVotes: PropTypes.bool.isRequired,
  groupWithAssociatedIdeasAndVotes: AppPropTypes.groupWithAssociatedIdeasAndVotes.isRequired,
  stage: AppPropTypes.stage.isRequired,
}

export default IdeaGroup
