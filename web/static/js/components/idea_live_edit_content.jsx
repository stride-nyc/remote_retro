import React from "react"

import * as AppPropTypes from "../prop_types"

const IdeaLiveEditContent = props => {
  const { idea } = props

  return (
    <div className="ui raised segment">
      <p className="ui center aligned sub dividing header">Facilitator is Editing</p>
      <span>{idea.liveEditText}</span>
    </div>
  )
}

IdeaLiveEditContent.propTypes = {
  idea: AppPropTypes.idea.isRequired,
}

export default IdeaLiveEditContent
