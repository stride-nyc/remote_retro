import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import PropTypes from "prop-types"

import * as AppPropTypes from "../prop_types"
import VotingInterface from "./voting_interface"
import RightFloatedIdeaActions from "./right_floated_idea_actions"
import { voteMax } from "../configs/retro_configs"
import STAGES from "../configs/stages"
import { selectors, actions } from "../redux"

const { IDEA_GENERATION, GROUPING, VOTING, CLOSED } = STAGES

export const StageAwareIdeaControls = props => {
  const {
    stage,
    idea,
    actions,
    currentUser,
    votes,
    voteCountForUser,
    canUserEditIdeaContents,
  } = props

  if (stage === GROUPING) return null

  const { category } = idea

  const allVotesUsed = voteCountForUser >= voteMax

  if (stage !== IDEA_GENERATION && category !== "action-item") {
    return (
      <VotingInterface
        actions={actions}
        idea={idea}
        votes={votes}
        buttonDisabled={stage !== VOTING || allVotesUsed}
        currentUser={currentUser}
        stage={stage}
      />
    )
  }

  if (stage === CLOSED) return null

  if (canUserEditIdeaContents) {
    return <RightFloatedIdeaActions {...props} />
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
  votes: AppPropTypes.votes.isRequired,
  voteCountForUser: PropTypes.number.isRequired,
}

const mapStateToProps = (state, { currentUser }) => {
  return {
    voteCountForUser: selectors.voteCountForUser(state, currentUser),
    votes: state.votes,
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StageAwareIdeaControls)
