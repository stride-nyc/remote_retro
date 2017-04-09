import React, { Component } from "react"
import IdeaControls from "./idea_controls"
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
    let isFacilitator = currentPresence.user.is_facilitator

    return (
      <li className={styles.index} title={idea.body} key={idea.id}>
        { isFacilitator && <IdeaControls idea={idea} handleDelete={handleDelete} /> }
        <span className={styles.authorAttribution}>{idea.author}:</span> {idea.body}
      </li>
    )
  }
}

Idea.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  handleDelete: React.PropTypes.func.isRequired,
}

export default Idea
