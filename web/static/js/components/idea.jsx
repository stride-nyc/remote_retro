import React from "react"
import classNames from "classnames"

import IdeaEditForm from "./idea_edit_form"
import IdeaLiveEditContent from "./idea_live_edit_content"
import IdeaReadOnlyContent from "./idea_read_only_content"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea.css"

const Idea = props => {
  const { idea, currentUser, retroChannel, stage, categories, category } = props
  const isFacilitator = currentUser.is_facilitator
  const isEdited = (+new Date(idea.updated_at) - +new Date(idea.inserted_at)) > 1000
  const classes = classNames(styles.index, {
    [styles.highlighted]: idea.isHighlighted,
  })

  const userIsEditing = idea.editing && idea.editorToken === currentUser.token

  const ideaControls = (
    <IdeaControls
      idea={idea}
      retroChannel={retroChannel}
      currentUser={currentUser}
      stage={stage}
    />
  )

  const editingMessage = (
    <p className="ui center aligned sub dividing header">Facilitator is Editing</p>
  )

  const ideaEditForm = (
    <IdeaEditForm
      idea={idea}
      retroChannel={retroChannel}
      categories={categories}
      category={category}
      stage={stage}
    />
  )

  const renderIdeaControls = () => {
    if (stage !== CLOSED) {
      return ideaControls
    }
    return null
  }

  let content
  if (userIsEditing) {
    content = <IdeaEditForm idea={idea} retroChannel={retroChannel} currentUser={currentUser} />
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
  stage: AppPropTypes.stage.isRequired,
  category: AppPropTypes.category.isRequired,
  categories: AppPropTypes.categories.isRequired,
}

export default Idea
