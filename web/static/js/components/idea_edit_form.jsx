import React, { Component } from "react"
import * as AppPropTypes from "../prop_types"

import SelectDropdown from "./select_dropdown"
import { CATEGORIES } from "../configs/retro_configs"
import STAGES from "../configs/stages"

const { ACTION_ITEMS } = STAGES

class IdeaEditForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ideaBody: props.idea.body,
      ideaCategory: props.idea.category,
      ideaAssigneeId: props.idea.assignee_id,
    }
    this.onChangeAssignee = this.onChangeAssignee.bind(this)
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

  onChangeAssignee(event) {
    this.setState({ ideaAssigneeId: Number.parseInt(event.target.value, 10) })
  }

  onCancel(event) {
    event.preventDefault()
    const { retroChannel, idea } = this.props
    retroChannel.push("disable_edit_state", { id: idea.id })
  }

  onSubmit(event) {
    event.preventDefault()
    const { idea, retroChannel } = this.props
    const { ideaBody, ideaCategory, ideaAssigneeId } = this.state

    retroChannel.push("idea_edited", {
      id: idea.id,
      body: ideaBody,
      category: ideaCategory,
      assigneeId: ideaAssigneeId,
    })
  }

  render() {
    const { stage, users } = this.props
    const { ideaCategory, ideaAssigneeId, ideaBody } = this.state
    const categories = CATEGORIES
    const categoryOptions = categories.map(category => (
      <option key={category} value={category}>{category}</option>
    ))
    const assigneeOptions = users.map(user => (
      <option key={user.id} value={user.id}>{user.name}</option>
    ))

    return (
      <form onSubmit={this.onSubmit} className="ui form raised segment idea-edit-form">
        <p className="ui center aligned sub header">Editing</p>
        {stage !== ACTION_ITEMS && <SelectDropdown
          labelName="editable_category"
          value={ideaCategory}
          onChange={this.onChangeIdeaCategory}
          selectOptions={categoryOptions}
        />}
        {stage === ACTION_ITEMS && <SelectDropdown
          labelName="editable_assignee"
          value={ideaAssigneeId || ""}
          onChange={this.onChangeAssignee}
          selectOptions={assigneeOptions}
        />}
        <div className="field">
          <textarea
            name="editable_idea"
            autoFocus
            rows="2"
            value={ideaBody}
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
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
  users: AppPropTypes.presences.isRequired,
}

export default IdeaEditForm
