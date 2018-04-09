import React from "react"
import { connect } from "react-redux"
import classNames from "classnames"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_controls.css"
import VoteCounter from "./vote_counter"
import { voteMax } from "../configs/retro_configs"
import STAGES from "../configs/stages"

const { IDEA_GENERATION, VOTING, CLOSED } = STAGES

export const IdeaControls = props => {
  const { idea, retroChannel, currentUser, stage, votes } = props
  if (stage === CLOSED) return null

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

    if (currentUser.is_facilitator || currentUser.id === userId) {
      const authorEditing = "Author currently editing"
      const noOp = () => {}
      return (
        <div className={styles.wrapper}>
          <i
            title={idea.editing ? authorEditing : "Delete Idea"}
            className={`${styles.actionIcon} remove circle icon ${idea.editing ? "disabled" : ""}`}
            onClick={() => { idea.editing ? noOp() : retroChannel.push("delete_idea", idea.id) }}
          />
          <i
            title={idea.editing ? authorEditing : "Edit Idea"}
            className={`${styles.actionIcon} edit icon ${idea.editing ? "disabled" : ""}`}
            onClick={() => { idea.editing ? noOp() : retroChannel.push("enable_edit_state", { idea, editorToken: currentUser.token }) }}
          />
          {
            currentUser.is_facilitator &&
            <i
              title={idea.editing ? authorEditing : highlightTitle}
              className={`${highlightClasses} ${idea.editing ? "disabled" : ""}`}
              onClick={() => { idea.editing ? noOp() : retroChannel.push("highlight_idea", { id, isHighlighted }) }}
            />
          }
        </div>
      )
    }

    return null
  }

  return renderIcons()
}

IdeaControls.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
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
