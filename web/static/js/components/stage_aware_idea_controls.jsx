import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import PropTypes from "prop-types"

import * as AppPropTypes from "../prop_types"
import VotingInterface from "./voting_interface"
import IdeaEditDeleteIcons from "./idea_edit_delete_icons"
import { VOTE_LIMIT } from "../configs/retro_configs"
import STAGES from "../configs/stages"
import { selectors, actions } from "../redux"

const { VOTING, ACTION_ITEMS, CLOSED } = STAGES

export const StageAwareIdeaControls = props => {
  const {
    stage,
    idea,
    actions,
    currentUser,
    votesForIdea,
    cumulativeVoteCountForUser,
    canUserEditIdeaContents,
  } = props

  const { category } = idea

  if ([VOTING, ACTION_ITEMS, CLOSED].includes(stage) && category !== "action-item") {
    return (
      <VotingInterface
        actions={actions}
        idea={idea}
        votesForIdea={votesForIdea}
        isVotingStage={stage === VOTING}
        userHasExhaustedVotes={cumulativeVoteCountForUser >= VOTE_LIMIT}
        currentUser={currentUser}
      />
    )
  }

  if (stage === CLOSED) return null

  if (canUserEditIdeaContents) {
    return <IdeaEditDeleteIcons {...props} />
  }

  return null
}

StageAwareIdeaControls.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  actions: AppPropTypes.actions.isRequired,
  canUserEditIdeaContents: PropTypes.bool.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
  votesForIdea: AppPropTypes.votes.isRequired,
  cumulativeVoteCountForUser: PropTypes.number.isRequired,
}

const mapStateToProps = (state, { currentUser, idea }) => {
  return {
    cumulativeVoteCountForUser: selectors.cumulativeVoteCountForUser(state, currentUser),
    votesForIdea: selectors.votesForIdea(state, idea),
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StageAwareIdeaControls)
