import React from "react"
import { idea } from "../prop_types"
import styles from "./css_modules/idea_item.css"

function IdeaListItem(props) {
  let { idea } = props

  return (
    <li className="item" title={idea.body} key={idea.id}>
      {idea.author}: {idea.body}
      <button
        id={idea.id}
        type="button"
        onClick={props.handleDelete}
        className={styles.delete}>
        x
      </button>
    </li>
  )
}

IdeaListItem.propTypes = {
  idea,
}

export default IdeaListItem
