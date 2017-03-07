import React from "react"

function IdeaListItem(props) {
  let body = props.body
  return (
    <li className="item" title={body} key={`${body}`}>{body}</li>
  )
}

IdeaListItem.propTypes = {
  body: React.PropTypes.string
}

export default IdeaListItem
