import React from "react"
import { idea } from "../prop_types"

function IdeaListItem(props) {
  let { idea } = props

  return (
    <li className="item" title={idea.body} key={idea.id}>
      {idea.author}: {idea.body}
    </li>
  )
}

IdeaListItem.propTypes = {
  idea,
}

export default IdeaListItem
