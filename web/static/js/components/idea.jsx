import React from "react"
import classNames from "classnames"

import IdeaControls from "./idea_controls"
import IdeaEditForm from "./idea_edit_form"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea.css"

const Idea = props => {
  const { idea, currentUser, retroChannel, stage } = props
  const isFacilitator = currentUser.is_facilitator
  const isEdited = (+new Date(idea.updated_at) - +new Date(idea.inserted_at)) > 1000
  const classes = classNames({
    [styles.index]: true,
    "ui raised segment": idea.editing,
    [styles.highlighted]: idea.isHighlighted,
  })

  const readOnlyIdea = (
    <div className={styles.ideaWrapper}>
      { idea.editing && !isFacilitator ?
        <p className="ui center aligned sub dividing header">Facilitator is Editing</p> : ""
      }
      {idea.liveEditText || idea.body}
      {isEdited && <span className={styles.editedIndicator}> (edited)</span>}
      <IdeaControls
        idea={idea}
        retroChannel={retroChannel}
        currentUser={currentUser}
        stage={stage}
      />
    </div>
  )

  return (
    <li className={classes} title={idea.body} key={idea.id}>
      { idea.editing && isFacilitator ?
        <IdeaEditForm idea={idea} retroChannel={retroChannel} />
        : readOnlyIdea
      }
    </li>
  )
}

Idea.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentUser: AppPropTypes.user.isRequired,
  stage: React.PropTypes.string.isRequired,
}

export default Idea
