import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import values from "lodash/values"

import IdeaEditForm from "./idea_edit_form"
import IdeaLiveEditContent from "./idea_live_edit_content"
import ConditionallyDraggableIdeaContent from "./conditionally_draggable_idea_content"
import IdeaPermissions from "../services/idea_permissions"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea.css"
import {
  selectors,
  actions,
} from "../redux"

export const Idea = ({
  idea,
  currentUser,
  isAnActionItemsStage,
  users,
  actions = {},
  ideaGenerationCategories,
  assignee = null,
  isTabletOrAbove,
  ...props
}) => {
  const userIsEditing = idea.inEditState && idea.isLocalEdit

  let content
  if (userIsEditing) {
    content = (
      <IdeaEditForm
        idea={idea}
        currentUser={currentUser}
        isAnActionItemsStage={isAnActionItemsStage}
        users={users}
        actions={actions}
        ideaGenerationCategories={ideaGenerationCategories}
      />
    )
  } else if (idea.liveEditText) {
    content = <IdeaLiveEditContent idea={idea} />
  } else {
    content = (
      <ConditionallyDraggableIdeaContent
        {...props}
        currentUser={currentUser}
        idea={idea}
        assignee={assignee}
        isTabletOrAbove={isTabletOrAbove}
      />
    )
  }

  return (
    <li className={styles.index} key={idea.id}>
      {content}
    </li>
  )
}

Idea.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
  assignee: AppPropTypes.presence,
  users: AppPropTypes.presences.isRequired,
  ideaGenerationCategories: AppPropTypes.ideaGenerationCategories.isRequired,
  actions: AppPropTypes.actions.isRequired,
  canUserEditIdeaContents: PropTypes.bool.isRequired,
  isTabletOrAbove: PropTypes.bool.isRequired,
  isAnActionItemsStage: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, { idea, currentUser }) => ({
  assignee: selectors.getUserById(state, idea.assignee_id),
  users: values(state.usersById),
  canUserEditIdeaContents: IdeaPermissions.canUserEditContents(idea, currentUser),
  isTabletOrAbove: selectors.isTabletOrAbove(state),
  isAnActionItemsStage: selectors.isAnActionItemsStage(state),
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Idea)
