import React, { Component } from "react"
import { connect } from "react-redux"
import throttle from "lodash/throttle"
import PropTypes from "prop-types"
import * as AppPropTypes from "../prop_types"
import { USER_TYPING_ANIMATION_DURATION } from "../services/user_activity"

import styles from "./css_modules/idea_submission_form.css"

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
    this.defaultCategory = "happy"
    this.state = {
      body: "",
      category: props.showActionItem ? "action-item" : this.defaultCategory,
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

  render() {
    const disabled = !this.state.body.length
    const defaultCategoryOptions = [
      <option key="happy" value="happy">happy</option>,
      <option key="sad" value="sad">sad</option>,
      <option key="confused" value="confused">confused</option>,
    ]
    let pointingLabel = null

    if (!this.state.ideaEntryStarted && this.props.stage === "idea-generation") {
      pointingLabel = (
        <div className={`${styles.pointingLabel} floating ui pointing below teal label`}>
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
  showActionItem: PropTypes.bool.isRequired,
  stage: AppPropTypes.stage,
}

IdeaSubmissionForm.defaultProps = {
  alert: null,
  stage: "idea-generation",
}

const mapStateToProps = ({ alert }) => ({ alert })

export default connect(
  mapStateToProps
)(IdeaSubmissionForm)
