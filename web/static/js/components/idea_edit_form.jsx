import React, { Component } from "react"
import * as AppPropTypes from "../prop_types"

import { CATEGORIES } from "../configs/retro_configs"

class IdeaEditForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ideaBody: props.idea.body,
      ideaCategory: props.idea.category,
    }
    this.onChangeIdeaBody = this.onChangeIdeaBody.bind(this)
    this.onChangeIdeaCategory = this.onChangeIdeaCategory.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }

  onChangeIdeaBody(event) {
    const { retroChannel, idea, currentUser } = this.props
    if (currentUser.is_facilitator) {
      retroChannel.push("idea_live_edit", { id: idea.id, liveEditText: event.target.value })
    }

    this.setState({ ideaBody: event.target.value })
  }

  onChangeIdeaCategory(event) {
    this.setState({ ideaCategory: event.target.value })
  }

  onCancel(event) {
    event.preventDefault()
    const { retroChannel, idea } = this.props
    retroChannel.push("disable_edit_state", { id: idea.id })
  }

  onSubmit(event) {
    event.preventDefault()
    const { idea, retroChannel } = this.props
    const { ideaBody, ideaCategory } = this.state
    retroChannel.push("idea_edited", {
      id: idea.id,
      body: ideaBody,
      category: ideaCategory,
    })
  }

  render() {
    const { stage } = this.props
    const categories = CATEGORIES

    return (
      <form onSubmit={this.onSubmit} className="ui form raised segment idea-edit-form">
        <p className="ui center aligned sub header">Editing</p>
        {stage !== "action-items" && <select
          name="editable_category"
          className="ui dropdown"
          onChange={this.onChangeIdeaCategory}
          value={this.state.ideaCategory}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>}
        <div className="field">
          <textarea
            name="editable_idea"
            autoFocus
            rows="2"
            value={this.state.ideaBody}
            onChange={this.onChangeIdeaBody}
          />
        </div>
        <div className="ui buttons">
          <button onClick={this.onCancel} className="ui cancel button">Cancel</button>
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
  currentUser: AppPropTypes.user.isRequired,
  stage: AppPropTypes.stage.isRequired,
}

export default IdeaEditForm
