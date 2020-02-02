import React from "react"
import PropTypes from "prop-types"
import * as AppPropTypes from "../prop_types"

import styles from "./css_modules/idea_group.css"
import ideaStyles from "./css_modules/idea.css"
import GroupLabelContainer from "./group_label_container"
import VotingInterface from "./voting_interface"

import STAGES from "../configs/stages"

const { LABELING_PLUS_VOTING } = STAGES

const IdeaGroup = ({
  groupWithAssociatedIdeasAndVotes,
  currentUser,
  actions,
  stage,
  currentUserHasExhaustedVotes,
}) => {
  const ideaToCastVoteFor = groupWithAssociatedIdeasAndVotes.ideas[0]
  const isVotingStage = stage === LABELING_PLUS_VOTING

  return (
    <div className={`idea-group ${styles.wrapper}`}>
      <GroupLabelContainer
        actions={actions}
        currentUser={currentUser}
        groupWithAssociatedIdeasAndVotes={groupWithAssociatedIdeasAndVotes}
        stage={stage}
      />

      <VotingInterface
        actions={actions}
        currentUser={currentUser}
        currentUserHasExhaustedVotes={currentUserHasExhaustedVotes}
        isVotingStage={isVotingStage}
        ideaToCastVoteFor={ideaToCastVoteFor}
        votesForEntity={groupWithAssociatedIdeasAndVotes.votes}
      />

      <ul className={styles.list}>
        {groupWithAssociatedIdeasAndVotes.ideas.map(idea => {
          return <li key={idea.id} className={ideaStyles.index}>{idea.body}</li>
        })}
      </ul>
    </div>
  )
}

IdeaGroup.propTypes = {
  actions: AppPropTypes.actions.isRequired,
  currentUser: AppPropTypes.user.isRequired,
  currentUserHasExhaustedVotes: PropTypes.bool.isRequired,
  groupWithAssociatedIdeasAndVotes: AppPropTypes.groupWithAssociatedIdeasAndVotes.isRequired,
  stage: AppPropTypes.stage.isRequired,
}

export default IdeaGroup
