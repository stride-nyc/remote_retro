// TODO: Test rewrite to handle the isIdeaDragEligible cases
import React from "react"
import { useDraggable } from "@dnd-kit/core"
import cx from "classnames"
import PropTypes from "prop-types"

import StageAwareIdeaControls from "./stage_aware_idea_controls"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_content_base.css"

const IdeaContentBase = ({
  idea,
  currentUser,
  stage,
  assignee = null,
  canUserEditIdeaContents = false,
  isIdeaDragEligible = false,
}) => {
  if (!idea || !stage || !currentUser) return null

  const isEdited = (+new Date(idea.updated_at) > +new Date(idea.inserted_at))

  const draggableProps = isIdeaDragEligible
    ? useDraggable({
      id: idea.id.toString(),
      data: { idea },
      disabled: idea.inEditState,
    })
    : { attributes: {}, listeners: {}, setNodeRef: null }

  const { attributes, listeners, setNodeRef } = draggableProps

  return (
    <div className={styles.ideaWrapper}>
      <div className={styles.ideaControls}>
        <StageAwareIdeaControls
          idea={idea}
          currentUser={currentUser}
          stage={stage}
          canUserEditIdeaContents={canUserEditIdeaContents}
        />
      </div>
      <div
        className={cx(styles.ideaContent, {
          [styles.draggable]: isIdeaDragEligible,
        })}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
      >
        <span>{ idea.body }</span>
        {assignee && <span className={styles.assignee}> ({assignee.name})</span>}
        {isEdited && <span className={styles.editedIndicator}> (edited)</span>}
      </div>
    </div>
  )
}

IdeaContentBase.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage,
  assignee: AppPropTypes.presence,
  canUserEditIdeaContents: PropTypes.bool,
  isIdeaDragEligible: PropTypes.bool,
}

export default IdeaContentBase
