import React from "react"
import IdeaControls from "./idea_controls"
import IdeaEditForm from "./idea_edit_form"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea.css"

const Idea = props => {
  const { idea, currentUser, retroChannel } = props
  const isFacilitator = currentUser.is_facilitator
  const isEdited = new Date(idea.updated_at) > new Date(idea.inserted_at)
  let classes = styles.index
  classes += idea.editing ? " ui raised segment" : ""

  const readOnlyIdea = (
    <div>
      { idea.editing && !isFacilitator ?
        <p className="ui center aligned sub dividing header">Facilitator is Editing</p> : ""
      }
      { isFacilitator &&
        <IdeaControls
          idea={idea}
          retroChannel={retroChannel}
        />
      }
      <span className={styles.authorAttribution}>
        {idea.author}:
      </span> {idea.liveEditText || idea.body}
      {isEdited && <span className={styles.editedIndicator}> (edited)</span>}
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
}

export default Idea
