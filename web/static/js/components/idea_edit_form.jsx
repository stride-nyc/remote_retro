import React, { Component } from "react"
import * as AppPropTypes from "../prop_types"

class IdeaEditForm extends Component {
  constructor(props) {
    super(props)
    this.state = { ideaBody: props.idea.body }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }

  onChange(event) {
    this.setState({ ideaBody: event.target.value })
  }

  onCancel(event) {
    event.preventDefault()
    const { retroChannel, idea } = this.props
    retroChannel.push("disable_edit_state", { id: idea.id })
  }

  onSubmit(event) {
    event.preventDefault()
    const { idea, retroChannel } = this.props
    const { ideaBody } = this.state
    retroChannel.push("idea_edited", { id: idea.id, body: ideaBody })
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} className="ui form">
        <p className="ui center aligned sub header">Editing</p>
        <div className="field">
          <textarea
            name="editable_idea"
            autoFocus
            rows="2"
            value={this.state.ideaBody}
            onChange={this.onChange}
          />
        </div>
        <div className="ui buttons">
          <button onClick={this.onCancel} className="ui button">Cancel</button>
          <div className="or" />
          <button type="submit" className="ui positive button">Save</button>
        </div>
      </form>
    )
  }
}

IdeaEditForm.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
}

export default IdeaEditForm
