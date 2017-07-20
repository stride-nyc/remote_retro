import React, { Component } from "react"
import * as AppPropTypes from "../prop_types"

import styles from "./css_modules/idea_submission_form.css"

const PLACEHOLDER_TEXTS = {
  happy: "we have a linter!",
  sad: "no one uses the linter...",
  confused: "what is a linter?",
  "action-item": "automate the linting process",
}

class IdeaSubmissionForm extends Component {
  constructor(props) {
    super(props)
    this.defaultCategory = "happy"
    this.state = {
      body: "",
      category: this.defaultCategory,
      ideaEntryStarted: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleIdeaChange = this.handleIdeaChange.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showActionItem !== this.props.showActionItem) {
      const category = nextProps.showActionItem ? "action-item" : this.defaultCategory
      this.setState({ category })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { actions: { toggleSubmitIdeaPromptPointer } } = this.props
    if (this.state.category !== prevState.category) { this.ideaInput.focus() }
    if (this.state.ideaEntryStarted !== prevState.ideaEntryStarted) {
      toggleSubmitIdeaPromptPointer(false)
    }
  }

  handleSubmit(event) {
    const { currentUser } = this.props
    event.preventDefault()
    const newIdea = { ...this.state, userId: currentUser.id }
    this.props.retroChannel.push("new_idea", newIdea)
    this.setState({ body: "" })
  }

  handleIdeaChange(event) {
    const { retroChannel, currentUser } = this.props
    retroChannel.push("user_typing_idea", { userToken: currentUser.token })
    this.setState({ body: event.target.value, ideaEntryStarted: true })
  }

  handleCategoryChange(event) {
    this.setState({ category: event.target.value })
  }

  render() {
    const { ui } = this.props
    const disabled = this.state.body.length < 3
    const defaultCategoryOptions = [
      <option key="happy" value="happy">happy</option>,
      <option key="sad" value="sad">sad</option>,
      <option key="confused" value="confused">confused</option>,
    ]
    let pointingLabel = null

    if (ui.submitIdeaPromptPointerVisible) {
      pointingLabel = (
        <div className="ui pointing below teal label">
          Submit an idea!
        </div>
      )
    }

    return (
      <form onSubmit={this.handleSubmit} className="ui form">
        {pointingLabel}
        <div className={`${styles.fields} fields`}>
          <div className={`${styles.flex} five wide inline field`}>
            <label htmlFor="category">Category:</label>
            <select
              name="category"
              value={this.state.category}
              className={`ui dropdown ${styles.select}`}
              onChange={this.handleCategoryChange}
            >
              { this.props.showActionItem ? <option value="action-item">action-item</option> :
                defaultCategoryOptions
              }
            </select>
          </div>
          <div className="eleven wide field">
            <div className="ui fluid action input">
              <input
                type="text"
                name="idea"
                autoFocus
                ref={input => { this.ideaInput = input }}
                value={this.state.body}
                onChange={this.handleIdeaChange}
                placeholder={`Ex. ${PLACEHOLDER_TEXTS[this.state.category]}`}
              />
              <button type="submit" disabled={disabled} className="ui teal button">Submit</button>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

IdeaSubmissionForm.propTypes = {
  currentUser: AppPropTypes.user.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  showActionItem: React.PropTypes.bool.isRequired,
  actions: React.PropTypes.object.isRequired,
  ui: React.PropTypes.object.isRequired,
}

export default IdeaSubmissionForm
