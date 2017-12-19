import React, { Component } from "react"
import { connect } from "react-redux"
import throttle from "lodash/throttle"
import * as AppPropTypes from "../prop_types"
import { USER_TYPING_ANIMATION_DURATION } from "../services/user_activity"

import styles from "./css_modules/idea_submission_form.css"

const pushUserTypingEventThrottled = throttle((retroChannel, currentUserToken) => {
  retroChannel.push("user_typing_action_item", { userToken: currentUserToken })
}, USER_TYPING_ANIMATION_DURATION - 100, { leading: true })

export class ActionItemSubmissionForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      body: "",
      actionItemEntryStarted: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleActionItemChange = this.handleActionItemChange.bind(this)
    this.handleAssigneeChange = this.handleAssigneeChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.alert && !nextProps.alert) { this.ideaInput.focus() }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.assigneeId !== prevState.assigneeId) { this.ideaInput.focus() }
  }

  handleSubmit(event) {
    const { currentUser } = this.props
    event.preventDefault()
    const newActionItem = { ...this.state, userId: currentUser.id }
    this.props.retroChannel.push("new_action_item", newActionItem)
    this.setState({ body: "" })
  }

  handleActionItemChange(event) {
    const { retroChannel, currentUser } = this.props
    pushUserTypingEventThrottled(retroChannel, currentUser.token)
    this.setState({ body: event.target.value, actionItemEntryStarted: true })
  }

  handleAssigneeChange(event) {
    this.setState({ assigneeId: Number.parseInt(event.target.value, 10) })
  }

  render() {
    const { body, assigneeId } = this.state
    const disabled = !(body.length && assigneeId)
    let pointingLabel = null

    if (!this.state.actionItemEntryStarted && this.props.stage === "action-items") {
      pointingLabel = (
        <div className={`${styles.pointingLabel} floating ui pointing below teal label`}>
          Create Action Items!
        </div>
      )
    }

    const assigneeOptions = this.props.users.map(({ id, name }) =>
      <option key={id} value={id}>{name}</option>
    )

    const defaultOption = (<option key={0} value={null}> -- </option>)

    return (
      <form onSubmit={this.handleSubmit} className="ui form">
        {pointingLabel}
        <div className={`${styles.fields} fields`}>
          <div className={`${styles.flex} five wide inline field`}>
            <label htmlFor="assignee">Assignee:</label>
            <select
              name="assignee"
              value={this.state.assigneeId}
              className={`ui dropdown ${styles.select}`}
              onChange={this.handleAssigneeChange}
            >
              { [ defaultOption, ...assigneeOptions ] }
            </select>
          </div>
          <div className="eleven wide field">
            <div className="ui fluid action input">
              <input
                type="text"
                name="idea"
                autoComplete="off"
                autoFocus
                ref={input => { this.ideaInput = input }}
                value={this.state.body}
                onChange={this.handleActionItemChange}
                placeholder="automate the linting process"
              />
              <button type="submit" disabled={disabled} className="ui teal button">Submit</button>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

ActionItemSubmissionForm.propTypes = {
  alert: AppPropTypes.alert,
  currentUser: AppPropTypes.user.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  users: AppPropTypes.users.isRequired,
  stage: AppPropTypes.stage,
}

ActionItemSubmissionForm.defaultProps = {
  alert: null,
  stage: "action-items",
}

const mapStateToProps = ({ alert }) => ({ alert })

export default connect(
  mapStateToProps
)(ActionItemSubmissionForm)
