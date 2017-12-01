import React from "react"
import classNames from "classnames"

import IdeaEditForm from "./idea_edit_form"
import IdeaLiveEditContent from "./idea_live_edit_content"
import IdeaReadOnlyContent from "./idea_read_only_content"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea.css"

const Idea = props => {
  const { idea, currentUser, retroChannel } = props
  const classes = classNames(styles.index, {
    [styles.highlighted]: idea.isHighlighted,
  })

  const userIsEditing = idea.editing && idea.editorToken === currentUser.token

  let content
  if (userIsEditing) {
    content = <IdeaEditForm idea={idea} retroChannel={retroChannel} />
  } else if (idea.liveEditText) {
    content = <IdeaLiveEditContent idea={idea} />
  } else {
    content = <IdeaReadOnlyContent {...props} />
  }

  return (
    <li className={classes} title={idea.body} key={idea.id}>
      { content }
    </li>
  )
}

Idea.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentUser: AppPropTypes.user.isRequired,
}

export default Idea
