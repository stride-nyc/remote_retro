import React from "react"
import * as AppPropTypes from "../prop_types"

import styles from "./css_modules/idea_group.css"
import ideaStyles from "./css_modules/idea.css"
import GroupLabelContainer from "./group_label_container"

const IdeaGroup = ({ groupWithAssociatedIdeasAndVotes, currentUser, actions }) => (
  <div className={`idea-group ${styles.wrapper}`}>
    <GroupLabelContainer
      actions={actions}
      currentUser={currentUser}
      groupWithAssociatedIdeasAndVotes={groupWithAssociatedIdeasAndVotes}
    />

    <ul className={styles.list}>
      {groupWithAssociatedIdeasAndVotes.ideas.map(idea => {
        return <li key={idea.id} className={ideaStyles.index}>{idea.body}</li>
      })}
    </ul>
  </div>
)

IdeaGroup.propTypes = {
  actions: AppPropTypes.actions.isRequired,
  currentUser: AppPropTypes.user.isRequired,
  groupWithAssociatedIdeasAndVotes: AppPropTypes.groupWithAssociatedIdeasAndVotes.isRequired,
}

export default IdeaGroup
