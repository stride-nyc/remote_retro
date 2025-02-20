import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import throttle from "lodash/throttle"
import values from "lodash/values"

import * as AppPropTypes from "../prop_types"
import { USER_TYPING_ANIMATION_DURATION } from "../services/user_activity"
import styles from "./css_modules/idea_submission_form.css"
import SelectDropdown from "./select_dropdown"
import { actions, selectors } from "../redux"

const PLACEHOLDER_TEXTS = {
  happy: "we have a linter!",
  sad: "no one uses the linter...",
  confused: "what is a linter?",
  start: "start test-driving our production code",
  stop: "stop chasing features that don't add clear business value",
  continue: "continue high-fiving whenever a test goes green",
  "action-item": "automate the linting process",
}

const pushUserTypingEventThrottled = throttle((actions, currentUserToken) => {
  actions.broadcastIdeaTypingEvent({ userToken: currentUserToken })
}, USER_TYPING_ANIMATION_DURATION - 100)

export class IdeaSubmissionForm extends Component {
  constructor(props) {
    super(props)

    const {
      users,
      ideaGenerationCategories,
      isAnActionItemsStage,
    } = props

    this.state = {
      body: "",
      category: isAnActionItemsStage ? "action-item" : ideaGenerationCategories[0],
      assigneeId: isAnActionItemsStage ? users[0].id : null,
      hasTypedChar: false,
      isMobileDevice: navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i),
    }
  }

  componentDidMount() {
    // account for autofocus in safari causing stagger on mount
    window.scrollTo(0, 0)
    document.body.scrollTop = 0
  }

  componentDidUpdate(prevProps, prevState) {
    const { category } = this.state
    if (category !== prevState.category) { this.ideaInput.focus() }
  }

  handleSubmit = event => {
    event.preventDefault()
    const { currentUser, actions } = this.props
    const { hasTypedChar, isMobileDevice, ...ideaParamsOnState } = this.state
    const newIdea = { ...ideaParamsOnState, userId: currentUser.id }
    actions.submitIdea(newIdea)
    this.setState({ body: "" })
  }

  handleBodyChange = event => {
    if (!event.isTrusted) { return } // ignore events triggered by extensions/scripts

    const { actions, currentUser } = this.props
    pushUserTypingEventThrottled(actions, currentUser.token)
    this.setState({ body: event.target.value, hasTypedChar: true })
  }

  handleCategoryChange = event => {
    this.setState({ category: event.target.value })
  }

  handleAssigneeChange = event => {
    this.setState({ assigneeId: parseInt(event.target.value, 10) })
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { alert } = this.props
    const { isMobileDevice } = this.state

    const alertDismissed = alert && !nextProps.alert

    if (alertDismissed && !isMobileDevice) { this.ideaInput.focus() }
  }

  render() {
    const { users, ideaGenerationCategories, isAnActionItemsStage } = this.props
    const { assigneeId, body, hasTypedChar, category, isMobileDevice } = this.state
    const disabled = !body.trim().length

    const assigneeOptions = users.map(({ id, name }) => <option key={id} value={id}>{name}</option>)
    const defaultCategoryOptions = ideaGenerationCategories.map(category => (
      <option key={category} value={category}>{category}</option>
    ))

    let showSubmitIdeaPrompt = false

    let dropdownProps = {}
    if (isAnActionItemsStage) {
      dropdownProps = {
        labelName: "assignee",
        value: assigneeId,
        onChange: this.handleAssigneeChange,
        selectOptions: assigneeOptions,
      }
    } else {
      showSubmitIdeaPrompt = !hasTypedChar
      dropdownProps = {
        labelName: "category",
        value: category,
        onChange: this.handleCategoryChange,
        selectOptions: defaultCategoryOptions,
      }
    }

    return (
      <form onSubmit={this.handleSubmit} className="ui form idea-submission">
        { showSubmitIdeaPrompt && (
          <div className={`${styles.pointingLabel} floating ui pointing below teal label`}>
            Submit an idea!
          </div>
        )}
        <div className={`${styles.fields} fields`}>
          <SelectDropdown {...dropdownProps} />
          <div className="eleven wide field">
            <div className="ui fluid action input">
              <label
                htmlFor="idea-body-input"
                className="visually-hidden"
              >
                Idea input
              </label>
              <input
                id="idea-body-input"
                type="text"
                name="idea"
                autoComplete="off"
                autoFocus={!isMobileDevice}
                ref={input => { this.ideaInput = input }}
                value={body}
                onChange={this.handleBodyChange}
                placeholder={`Ex. ${PLACEHOLDER_TEXTS[category]}`}
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
  ideaGenerationCategories: AppPropTypes.ideaGenerationCategories.isRequired,
  users: AppPropTypes.presences.isRequired,
  actions: AppPropTypes.actions.isRequired,
  isAnActionItemsStage: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  alert: state.alert,
  users: values(state.usersById),
  ideaGenerationCategories: state.ideaGenerationCategories,
  isAnActionItemsStage: selectors.isAnActionItemsStage(state),
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IdeaSubmissionForm)
