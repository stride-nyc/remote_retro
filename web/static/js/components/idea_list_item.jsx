import React from "react"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_item.css"

function IdeaListItem(props) {
  let { idea, currentPresence } = props

  return (
    <li className="item" title={idea.body} key={idea.id}>
      {idea.author}: {idea.body}
      { currentPresence.user.facilitator ?
        <button
          id={idea.id}
          type="button"
          onClick={props.handleDelete}
          className={styles.delete}>
          x
        </button> : null
      }
    </li>
  )
}

IdeaListItem.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  currentPresence: AppPropTypes.presence.isRequired,
}

export default IdeaListItem
