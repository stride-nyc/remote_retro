import React, { Component } from "react"
import { connect } from "react-redux"
import throttle from "lodash/throttle"
import * as AppPropTypes from "../prop_types"
import { USER_TYPING_ANIMATION_DURATION } from "../services/user_activity"

import styles from "./css_modules/idea_submission_form.css"
import STAGES from "../configs/stages"

const { IDEA_GENERATION, ACTION_ITEMS } = STAGES

const PLACEHOLDER_TEXTS = {
  happy: "we have a linter!",
  sad: "no one uses the linter...",
  confused: "what is a linter?",
  "action-item": "automate the linting process",
}

const pushUserTypingEventThrottled = throttle((retroChannel, currentUserToken) => {
  retroChannel.push("user_typing_idea", { userToken: currentUserToken })
}, USER_TYPING_ANIMATION_DURATION - 100)

export class IdeaSubmissionForm extends Component {
  constructor(props) {
    super(props)
    this.defaultCategory = this.props.stage === ACTION_ITEMS ? "action-item" : "happy"
    this.state = {
      body: "",
      category: this.defaultCategory,
      ideaEntryStarted: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleIdeaChange = this.handleIdeaChange.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
    this.handleAssigneeChange = this.handleAssigneeChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.alert && !nextProps.alert) { this.ideaInput.focus() }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.category !== prevState.category) { this.ideaInput.focus() }
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
    pushUserTypingEventThrottled(retroChannel, currentUser.token)
    this.setState({ body: event.target.value, ideaEntryStarted: true })
  }

  handleCategoryChange(event) {
    this.setState({ category: event.target.value })
  }

  handleAssigneeChange(event) {
    this.setState({ assigneeId: Number.parseInt(event.target.value, 10) })
  }

  render() {
    const { users, stage } = this.props
    const { assigneeId, body, ideaEntryStarted, category } = this.state
    let disabled = !body.length
    if (stage === ACTION_ITEMS) {
      disabled = !(body.length && assigneeId)
    }
    const assigneeOptions = users.map(({ id, name }) =>
      <option key={id} value={id}>{name}</option>
    )
    const defaultOption = (<option key={0} value={null}> -- </option>)

    const defaultCategoryOptions = [
      <option key="happy" value="happy">happy</option>,
      <option key="sad" value="sad">sad</option>,
      <option key="confused" value="confused">confused</option>,
    ]
    const label = text =>
      <div className={`${styles.pointingLabel} floating ui pointing below teal label`}>
        {text}
      </div>
    let pointingLabel = null

    if (!ideaEntryStarted && stage === IDEA_GENERATION) {
      pointingLabel = label("Submit an idea!")
    } else if (!ideaEntryStarted && stage === ACTION_ITEMS) {
      pointingLabel = label("Create Action Items!")
    }

    return (
      <form onSubmit={this.handleSubmit} className="ui form">
        {pointingLabel}
        <div className={`${styles.fields} fields`}>
          <div className={`${styles.flex} five wide inline field`}>
            {stage === IDEA_GENERATION && <div>
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                name="category"
                value={category}
                className={`ui dropdown ${styles.select}`}
                onChange={this.handleCategoryChange}
              >
                {defaultCategoryOptions}
              </select>
              </div>
            }
            {stage === ACTION_ITEMS && <div>
              <label htmlFor="assignee">Assignee:</label>
              <select
                name="assignee"
                value={assigneeId}
                className={`ui dropdown ${styles.select}`}
                onChange={this.handleAssigneeChange}
              >
                { [defaultOption, ...assigneeOptions] }
              </select>
            </div>
            }
          </div>
          <div className="eleven wide field">
            <div className="ui fluid action input">
              <label htmlFor="idea-body-input" className="visually-hidden">Idea input</label>
              <input
                id="idea-body-input"
                type="text"
                name="idea"
                autoComplete="off"
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
  alert: AppPropTypes.alert,
  currentUser: AppPropTypes.user.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  users: AppPropTypes.users.isRequired,
  stage: AppPropTypes.stage,
}

IdeaSubmissionForm.defaultProps = {
  alert: null,
  stage: IDEA_GENERATION,
}

const mapStateToProps = ({ alert }) => ({ alert })

export default connect(
  mapStateToProps
)(IdeaSubmissionForm)
