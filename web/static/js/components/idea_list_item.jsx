import React from "react"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_item.css"

function IdeaListItem(props) {
  let { idea, currentPresence } = props

  return (
    <li className="item" title={idea.body} key={idea.id}>
      {idea.author}: {idea.body}
      { currentPresence.user.is_facilitator ?
        <i
          id={idea.id}
          className={styles.delete + ` remove circle icon`}
          onClick={props.handleDelete}
        >
        </i> : null
      }
    </li>
  )
}

IdeaListItem.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  currentPresence: AppPropTypes.presence.isRequired,
}

export default IdeaListItem
