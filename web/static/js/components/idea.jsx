import React, { Component } from "react"
import IdeaControls from "./idea_controls"
import IdeaEditForm from "./idea_edit_form"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea.css"

class Idea extends Component {
  render() {
    const { idea, currentPresence, handleDelete, retroChannel } = this.props
    const isFacilitator = currentPresence.user.is_facilitator
    let classes = styles.index
    classes += idea.editing ? " ui raised segment" : ""

    const readOnlyIdea = (
      <div>
        { idea.editing && !isFacilitator ?
          <p>Facilitator is Editing:</p> : ""
        }
        { isFacilitator &&
          <IdeaControls
            idea={idea}
            handleDelete={handleDelete}
            retroChannel={retroChannel}
          />
        }
        <span className={styles.authorAttribution}>{idea.author}:</span> {idea.body}
      </div>
    )

    return (
      <li className={classes} title={idea.body} key={idea.id}>
        { idea.editing && isFacilitator ?
          <IdeaEditForm idea={idea} retroChannel={retroChannel} /> : readOnlyIdea
        }
      </li>
    )
  }
}

Idea.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  handleDelete: React.PropTypes.func.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentPresence: AppPropTypes.presence.isRequired,
}

export default Idea
