import React from "react"
import IdeaControls from "./idea_controls"
import IdeaEditForm from "./idea_edit_form"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea.css"

function Idea(props) {
  const { idea, currentPresence, handleDelete, retroChannel } = props
  const isFacilitator = currentPresence.user.is_facilitator
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
          handleDelete={handleDelete}
          retroChannel={retroChannel}
        />
      }
      <span className={styles.authorAttribution}>
        {idea.author}:
      </span> {idea.body} { isEdited && <span className={styles.editedIndicator}>(edited)</span> }
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
  handleDelete: React.PropTypes.func.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentPresence: AppPropTypes.presence.isRequired,
}

export default Idea
