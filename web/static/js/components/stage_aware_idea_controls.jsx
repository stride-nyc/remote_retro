import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import PropTypes from "prop-types"
import includes from "lodash/includes"

import * as AppPropTypes from "../prop_types"
import VotingInterface from "./voting_interface"
import IdeaEditDeleteIcons from "./idea_edit_delete_icons"
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
    currentUserHasExhaustedVotes,
    canUserEditIdeaContents,
  } = props

  const { category } = idea

  if (includes([VOTING, ACTION_ITEMS, CLOSED], stage) && category !== "action-item") {
    return (
      <VotingInterface
        actions={actions}
        ideaToCastVoteFor={idea}
        votesForEntity={votesForIdea}
        isVotingStage={stage === VOTING}
        currentUserHasExhaustedVotes={currentUserHasExhaustedVotes}
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
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
  votesForIdea: AppPropTypes.votes.isRequired,
  currentUserHasExhaustedVotes: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, { currentUser, idea }) => {
  return {
    currentUserHasExhaustedVotes: selectors.currentUserHasExhaustedVotes(state, currentUser),
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
