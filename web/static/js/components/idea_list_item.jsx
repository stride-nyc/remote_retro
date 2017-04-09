import React, { PropTypes } from "react"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_list_item.css"

function IdeaListItem(props) {
  const { idea, currentPresence } = props

  return (
    <li className={styles.index} title={idea.body} key={idea.id}>
      { currentPresence.user.is_facilitator ?
        <i
          id={idea.id}
          title="Delete Idea"
          className={`${styles.delete} remove circle icon`}
          onClick={props.handleDelete}
        />
        : null
      }
      <span className={styles.authorAttribution}>{idea.author}:</span> {idea.body}
    </li>
  )
}

IdeaListItem.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  currentPresence: AppPropTypes.presence.isRequired,
  handleDelete: PropTypes.func,
}

export default IdeaListItem
