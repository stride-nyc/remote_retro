import React from "react"
import { connect } from "react-redux"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/stage_aware_idea_controls.css"
import VoteCounter from "./vote_counter"
import { voteMax } from "../configs/retro_configs"
import STAGES from "../configs/stages"

const { IDEA_GENERATION, VOTING, CLOSED } = STAGES

export const StageAwareIdeaControls = props => {
  const { idea, retroChannel, currentUser, stage, votes } = props
  if (stage === CLOSED) return null

  const { id, user_id: userId, isHighlighted = false, category } = idea
  const highlightTitle = isHighlighted ? "De-Highlight Idea for Participants" : "Announce Idea to Channel"
  const voteCount = votes.filter(vote => vote.user_id === currentUser.id).length

  const allVotesUsed = voteCount >= voteMax

  if (stage !== IDEA_GENERATION && category !== "action-item") {
    return (
      <VoteCounter
        retroChannel={retroChannel}
        idea={idea}
        votes={votes}
        buttonDisabled={stage !== VOTING || allVotesUsed}
        currentUser={currentUser}
        stage={stage}
      />
    )
  }

  if (currentUser.is_facilitator || currentUser.id === userId) {
    return (
      <span className={`${styles.wrapper} ${idea.editing ? "disabled" : ""}`}>
        {
          currentUser.is_facilitator &&
          <i
            title={highlightTitle}
            className={`${!isHighlighted ? "announcement" : "ban"} icon`}
            onClick={() => { retroChannel.push("highlight_idea", { id, isHighlighted }) }}
          />
        }
        <i
          title="Edit Idea"
          className="edit icon"
          onClick={() => { retroChannel.push("enable_idea_edit_state", { id: idea.id, editorToken: currentUser.token }) }}
        />
        <i
          title="Delete Idea"
          className="remove circle icon"
          onClick={() => { retroChannel.push("idea_deleted", idea.id) }}
        />
      </span>
    )
  }

  return null
}

StageAwareIdeaControls.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
  votes: AppPropTypes.votes.isRequired,
}

const mapStateToProps = ({ votes }) => ({ votes })

export default connect(
  mapStateToProps
)(StageAwareIdeaControls)
