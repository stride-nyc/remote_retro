import React, { Component, PropTypes } from "react"
import * as AppPropTypes from "../prop_types"

class IdeaEditForm extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { idea } = this.props

    return (
      <form className="ui form">
        <div className="field">
          <textarea autoFocus rows="2" value={idea.body}></textarea>
        </div>
        <div className="ui buttons">
          <button className="ui button">Cancel</button>
          <div className="or"></div>
          <button className="ui positive button">Save</button>
        </div>
      </form>
    )
  }
}

IdeaEditForm.propTypes = {
  idea: AppPropTypes.idea.isRequired,
}

export default IdeaEditForm
