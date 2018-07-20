import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import PropTypes from "prop-types"

import * as AppPropTypes from "../prop_types"
import VoteCounter from "./vote_counter"
import RightFloatedIdeaActions from "./right_floated_idea_actions"
import { voteMax } from "../configs/retro_configs"
import STAGES from "../configs/stages"
import { selectors, actions } from "../redux"

const { IDEA_GENERATION, VOTING, CLOSED } = STAGES

export const StageAwareIdeaControls = props => {
  const {
    stage,
    idea,
    actions,
    currentUser,
    votes,
    voteCountForUser,
  } = props

  if (stage === CLOSED) return null

  const { user_id: userId, category } = idea

  const allVotesUsed = voteCountForUser >= voteMax

  if (stage !== IDEA_GENERATION && category !== "action-item") {
    return (
      <VoteCounter
        actions={actions}
        idea={idea}
        votes={votes}
        buttonDisabled={stage !== VOTING || allVotesUsed}
        currentUser={currentUser}
        stage={stage}
      />
    )
  }

  if (currentUser.is_facilitator || currentUser.id === userId) {
    return <RightFloatedIdeaActions {...props} />
  }

  return null
}

StageAwareIdeaControls.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  actions: PropTypes.object.isRequired,
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
