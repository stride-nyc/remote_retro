import React from "react"
import * as AppPropTypes from "../prop_types"

const IdeaGroup = ({ groupWithAssociatedIdeas, currentUser, actions }) => (
  <div>
    {currentUser.is_facilitator && (
      <div className="ui transparent input">
        <input
          type="text"
          placeholder="Add a group title"
          onBlur={e => actions.submitGroupTitle(e.target.value)}
        />
      </div>
    )}
    <ul>
      {groupWithAssociatedIdeas.ideas.map(idea => {
        return <li key={idea.id}>{idea.body}</li>
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
