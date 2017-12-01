import React from "react"
import { connect } from "react-redux"
import classNames from "classnames"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_controls.css"
import VoteCounter from "./vote_counter"
import { voteMax } from "../configs/retro_configs"
import STAGES from "../configs/stages"

const { IDEA_GENERATION, VOTING } = STAGES

export const IdeaControls = props => {
  const { idea, retroChannel, currentUser, stage, votes } = props
  const { id, user_id: userId, isHighlighted = false, category } = idea
  const highlightClasses = classNames(`icon ${styles.actionIcon}`, {
    announcement: !isHighlighted,
    ban: isHighlighted,
  })
  const highlightTitle = isHighlighted ? "De-Highlight Idea for Participants" : "Announce Idea to Channel"
  const voteCount = votes.filter(vote => vote.user_id === currentUser.id).length

  const cannotVote = voteCount >= voteMax

  function renderIcons() {
    if (stage !== IDEA_GENERATION && category !== "action-item") {
      return (
        <VoteCounter
          retroChannel={retroChannel}
          idea={idea}
          votes={votes}
          buttonDisabled={stage !== VOTING || cannotVote}
          currentUser={currentUser}
          stage={stage}
        />
      )
    }
    if (currentUser.is_facilitator) {
      return (
        <div className={styles.wrapper}>
          <i
            title="Delete Idea"
            className={`${styles.actionIcon} remove circle icon`}
            onClick={() => { retroChannel.push("delete_idea", idea.id) }}
          />
          <i
            title="Edit Idea"
            className={`${styles.actionIcon} edit icon`}
            onClick={() => { retroChannel.push("enable_edit_state", idea) }}
          />
          <i
            title={highlightTitle}
            className={highlightClasses}
            onClick={() => { retroChannel.push("highlight_idea", { id, isHighlighted }) }}
          />
        </div>
      )
    }

    if (currentUser.id === userId) {
      return (
        <i
          title="Delete Idea"
          className={`${styles.actionIcon} remove circle icon`}
          onClick={() => { retroChannel.push("delete_idea", idea.id) }}
        />
      )
    }
    return null
  }

  return renderIcons()
}

IdeaControls.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentUser: AppPropTypes.user.isRequired,
  stage: AppPropTypes.stage.isRequired,
  votes: AppPropTypes.votes,
}

IdeaControls.defaultProps = {
  votes: [],
}

const mapStateToProps = ({ votes }) => ({ votes })

export default connect(
  mapStateToProps
)(IdeaControls)
