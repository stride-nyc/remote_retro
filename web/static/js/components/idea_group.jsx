import React from "react"
import * as AppPropTypes from "../prop_types"

import styles from "./css_modules/idea_group.css"
import ideaStyles from "./css_modules/idea.css"

const IdeaGroup = ({ groupWithAssociatedIdeas, currentUser, actions }) => (
  <div className={`idea-group ${styles.wrapper}`}>
    {currentUser.is_facilitator && (
      <div className={`ui transparent input ${styles.labelInputWrapper}`}>
        <input
          type="text"
          placeholder="Add a group name"
          onBlur={e => actions.submitGroupName(e.target.value)}
        />
      </div>
    )}
    <ul className={styles.list}>
      {groupWithAssociatedIdeas.ideas.map(idea => {
        return <li key={idea.id} className={ideaStyles.index}>{idea.body}</li>
      })}
    </ul>
  </div>
)

IdeaGroup.propTypes = {
  actions: AppPropTypes.actions.isRequired,
  currentUser: AppPropTypes.user.isRequired,
  groupWithAssociatedIdeas: AppPropTypes.groupWithAssociatedIdeas.isRequired,
}

export default IdeaGroup
