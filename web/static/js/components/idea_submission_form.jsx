import React, { Component } from "react"
import { connect } from "react-redux"
import throttle from "lodash/throttle"
import values from "lodash/values"
import PropTypes from "prop-types"

import * as AppPropTypes from "../prop_types"

import { USER_TYPING_ANIMATION_DURATION } from "../services/user_activity"

import styles from "./css_modules/idea_submission_form.css"
import STAGES from "../configs/stages"
import SelectDropdown from "./select_dropdown"

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
    const { stage, users } = props
    const isActionItemsStage = stage === ACTION_ITEMS
    this.state = {
      body: "",
      category: isActionItemsStage ? "action-item" : "happy",
      assigneeId: isActionItemsStage ? users[0].id : null,
      hasTypedChar: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleBodyChange = this.handleBodyChange.bind(this)
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
    this.props.retroChannel.push("idea_submitted", newIdea)
    this.setState({ body: "" })
  }

  handleBodyChange(event) {
    if (!event.isTrusted) { return } // ignore events triggered by extensions/scripts

    const { retroChannel, currentUser, presences, usersById } = this.props
    if (!currentUser.id) {
      Honeybadger.notify({ usersById, presences, userToken: window.userToken }, "CurrentUserDerivationLacksId")
    }
    pushUserTypingEventThrottled(retroChannel, currentUser.token)
    this.setState({ body: event.target.value, hasTypedChar: true })
  }

  handleCategoryChange(event) {
    this.setState({ category: event.target.value })
  }

  handleAssigneeChange(event) {
    this.setState({ assigneeId: Number.parseInt(event.target.value, 10) })
  }

  render() {
    const { users, stage } = this.props
    const { assigneeId, body, hasTypedChar, category } = this.state
    const disabled = !body.trim().length
    const assigneeOptions = users.map(({ id, name }) =>
      <option key={id} value={id}>{name}</option>
    )
    const defaultCategoryOptions = [
      <option key="happy" value="happy">happy</option>,
      <option key="sad" value="sad">sad</option>,
      <option key="confused" value="confused">confused</option>,
    ]

    let showSubmitIdeaPrompt = false
    let dropdownProps = {}

    if (stage === IDEA_GENERATION) {
      showSubmitIdeaPrompt = !hasTypedChar
      dropdownProps = {
        labelName: "category",
        value: category,
        onChange: this.handleCategoryChange,
        selectOptions: defaultCategoryOptions,
      }
    } else if (stage === ACTION_ITEMS) {
      dropdownProps = {
        labelName: "assignee",
        value: assigneeId,
        onChange: this.handleAssigneeChange,
        selectOptions: assigneeOptions,
      }
    }

    return (
      <form onSubmit={this.handleSubmit} className="ui form">
        { showSubmitIdeaPrompt &&
          <div className={`${styles.pointingLabel} floating ui pointing below teal label`}>
            Submit an idea!
          </div>
        }
        <div className={`${styles.fields} fields`}>
          <SelectDropdown {...dropdownProps} />
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
                value={body}
                onChange={this.handleBodyChange}
                placeholder={`Ex. ${PLACEHOLDER_TEXTS[this.state.category]}`}
                maxLength="255"
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
  currentUser: AppPropTypes.presence.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  users: AppPropTypes.presences.isRequired,
  stage: AppPropTypes.stage,
  /* eslint-disable react/require-default-props */
  usersById: PropTypes.object,
  presences: AppPropTypes.presences,
  /* eslint-enable react/require-default-props */
}

IdeaSubmissionForm.defaultProps = {
  alert: null,
  stage: IDEA_GENERATION,
}

const mapStateToProps = ({ alert, usersById, presences }) => {
  return {
    alert,
    users: values(usersById),
    // presences and usersById included for debugging presence issues
    presences,
    usersById,
  }
}

export default connect(
  mapStateToProps
)(IdeaSubmissionForm)
