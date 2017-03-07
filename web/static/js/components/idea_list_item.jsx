import React from "react"
import styles from "./css_modules/idea_item.css"

function IdeaListItem(props) {
  let idea = props.idea
  return (
    <li className="item" title={idea.body}>
    {idea.body}
      <button id={idea.id} type='button' onClick={props.handleDelete} className={styles.delete}>x</button>
    </li>
  )
}

IdeaListItem.propTypes = {
  body: React.PropTypes.string
}

export default IdeaListItem
