import React, { Component } from "react"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea.css"

class Idea extends Component {
  constructor(props) {
    super(props)
    this.state = { editing: false }
    this.enableEditState = this.enableEditState.bind(this)
  }

  enableEditState() {
    this.setState({ editing: true })
  }

  render() {
    let { idea, currentPresence, handleDelete } = this.props
    const ideaControls = (
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
          onClick={this.enableEditState}
        >
        </i>
      </span>
    )

    return (
      <li className={styles.index} title={idea.body} key={idea.id}>
        Editing: { this.state.editing && 'true' }
        { currentPresence.user.is_facilitator ? ideaControls : null }
        <span className={styles.authorAttribution}>{idea.author}:</span> {idea.body}
      </li>
    )
  }
}

Idea.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  currentPresence: AppPropTypes.presence.isRequired,
  handleDelete: PropTypes.func,
}

export default Idea
