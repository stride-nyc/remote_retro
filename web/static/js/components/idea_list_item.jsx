import React, { Component } from "react"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_list_item.css"

class IdeaListItem extends Component {
  render() {
    let { idea, currentPresence, handleDelete } = this.props

    return (
      <li className={styles.index} title={idea.body} key={idea.id}>
        { currentPresence.user.is_facilitator ?
          <span>
            <i
              id={idea.id}
              title="Delete Idea"
              className={styles.actionIcon + ` remove circle icon`}
              onClick={handleDelete}
            >
            </i>
            <i
              title="Edit Idea"
              className={styles.actionIcon + ` edit icon`}
            >
            </i>
          </span> : null
        }
        <span className={styles.authorAttribution}>{idea.author}:</span> {idea.body}
      </li>
    )
  }
}

IdeaListItem.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  currentPresence: AppPropTypes.presence.isRequired,
  handleDelete: PropTypes.func,
}

export default IdeaListItem
