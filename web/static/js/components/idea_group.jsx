import React from "react"
import * as AppPropTypes from "../prop_types"

import styles from "./css_modules/idea_group.css"
import ideaStyles from "./css_modules/idea.css"

// This max length is presentational more than anything, ensuring it doesn't
// exceed the 1/4th column width on desktop, even with the widest possible characters
const MAX_LENGTH_OF_GROUP_NAME = 20

const IdeaGroup = ({ groupWithAssociatedIdeasAndVotes, currentUser, actions }) => (
  <div className={`idea-group ${styles.wrapper}`}>
    {currentUser.is_facilitator ? (
      <div className={`ui transparent input ${styles.labelInputWrapper}`}>
        <input
          type="text"
          placeholder="Add a group name"
          defaultValue={groupWithAssociatedIdeasAndVotes.name}
          maxLength={MAX_LENGTH_OF_GROUP_NAME}
          onBlur={e => {
            actions.submitGroupNameChanges(groupWithAssociatedIdeasAndVotes, e.target.value)
          }}
        />
        <div className="instruction">
          <span className="keyboard-key">tab</span> to submit
        </div>
      </div>
    ) : (
      <p className="readonly-group-name">{groupWithAssociatedIdeasAndVotes.name}</p>
    )}
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
