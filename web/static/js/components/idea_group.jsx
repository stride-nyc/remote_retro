import React from "react"
import * as AppPropTypes from "../prop_types"

const IdeaGroup = ({ groupWithAssociatedIdeas }) => (
  <div>
    <ul>
      {groupWithAssociatedIdeas.ideas.map(idea => {
        return <li key={idea.id}>{idea.body}</li>
      })}
    </ul>
  </div>
)

IdeaGroup.propTypes = {
  groupWithAssociatedIdeas: AppPropTypes.groupWithAssociatedIdeas.isRequired,
}

export default IdeaGroup
