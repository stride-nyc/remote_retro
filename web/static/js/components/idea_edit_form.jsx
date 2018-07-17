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
      ideaBodyError: undefined,
    }
    this.onChangeAssignee = this.onChangeAssignee.bind(this)
    this.onChangeIdeaBody = this.onChangeIdeaBody.bind(this)
    this.onChangeIdeaCategory = this.onChangeIdeaCategory.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }

  onChangeIdeaBody({ target }) {
    let newIdeaBodyError
    const { retroChannel, idea, currentUser } = this.props

    if (currentUser.is_facilitator) {
      retroChannel.push("idea_live_edit", { id: idea.id, liveEditText: target.value })
    }

    const trimmedValue = target.value.trim()
    if (trimmedValue === "") {
      newIdeaBodyError = "Ideas must have content."
    } else if (trimmedValue.length > 255) {
      newIdeaBodyError = "Idea cannot exceed 255 characters."
    }

    this.setState({ ideaBody: target.value, ideaBodyError: newIdeaBodyError })
  }

  onChangeIdeaCategory({ target }) {
    this.setState({ ideaCategory: target.value })
  }

  onChangeAssignee({ target }) {
    this.setState({ ideaAssigneeId: Number.parseInt(target.value, 10) })
  }

  onCancel(event) {
    event.preventDefault()
    const { retroChannel, idea } = this.props
    retroChannel.push("idea_edit_state_disabled", { id: idea.id })
  }

  onSubmit(event) {
    event.preventDefault()
    const { idea, retroChannel } = this.props
    const { ideaBody, ideaCategory, ideaAssigneeId } = this.state

    retroChannel.push("idea_edited", {
      id: idea.id,
      body: ideaBody.trim(),
      category: ideaCategory,
      assigneeId: ideaAssigneeId,
    })
  }

  render() {
    const { stage, users } = this.props
    const { ideaCategory, ideaAssigneeId, ideaBody, ideaBodyError } = this.state
    const categoryOptions = CATEGORIES.map(category => (
      <option key={category} value={category}>{category}</option>
    ))
    const assigneeOptions = users.map(user => (
      <option key={user.id} value={user.id}>{user.name}</option>
    ))

    return (
      <form onSubmit={this.onSubmit} className="ui error form raised segment idea-edit-form">
        <p className="ui center aligned sub header">Editing</p>
        {stage !== ACTION_ITEMS && <SelectDropdown
          labelName="editable_category"
          value={ideaCategory}
          onChange={this.onChangeIdeaCategory}
          selectOptions={categoryOptions}
          showLabel={false}
        />}
        {stage === ACTION_ITEMS && <SelectDropdown
          labelName="editable_assignee"
          value={ideaAssigneeId}
          onChange={this.onChangeAssignee}
          selectOptions={assigneeOptions}
          showLabel={false}
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

        { ideaBodyError &&
          <div className="ui error message">
            <p>{ideaBodyError}</p>
          </div>
        }
        <div className="ui buttons">
          <button onClick={this.onCancel} className="ui cancel button">Cancel</button>
          <div className="or" />
          <button
            type="submit"
            disabled={!!ideaBodyError}
            className="ui positive button"
          >
            Save
          </button>
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
