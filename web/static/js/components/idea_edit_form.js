import React, { Component, PropTypes } from "react"
import * as AppPropTypes from "../prop_types"

class IdeaEditForm extends Component {
  constructor(props) {
    super(props)
    this.state = { ideaBody: props.idea.body }
    this.onChange = this.onChange.bind(this)
  }

  onChange(event) {
    this.setState({ ideaBody: event.target.value })
  }

  render() {
    return (
      <form className="ui form">
        <div className="field">
          <textarea autoFocus rows="2" value={this.state.ideaBody} onChange={this.onChange}></textarea>
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
