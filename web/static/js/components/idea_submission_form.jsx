import React, { Component } from "react"

import styles from "./css_modules/idea_submission_form.css"

class IdeaSubmissionForm extends Component {
  constructor(props) {
    super(props)
    this.defaultCategory = "happy"
    this.state = { body: "", category: this.defaultCategory }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleIdeaChange = this.handleIdeaChange.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
    this.handleToggleChange = this.handleToggleChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showActionItem !== this.props.showActionItem) {
      const category = nextProps.showActionItem ? "action-item" : this.defaultCategory
      this.setState({ category })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.category !== prevState.category) { this.ideaInput.focus() }
  }

  handleSubmit(event) {
    event.preventDefault()
    this.setState({ body: "" })
    this.props.onIdeaSubmission(this.state)
  }

  handleIdeaChange(event) {
    this.setState({ body: event.target.value })
  }

  handleCategoryChange(event) {
    this.setState({ category: event.target.value })
  }

  handleToggleChange() {
    this.props.onToggleActionItem()
  }

  render() {
    const disabled = this.state.body.length < 3
    const defaultCategoryOptions = [
      <option key="happy" value="happy">happy</option>,
      <option key="sad" value="sad">sad</option>,
      <option key="confused" value="confused">confused</option>,
    ]

    return (
      <form onSubmit={this.handleSubmit} className="ui form basic attached secondary segment">
        <div className="inline fields">
            <div className="three wide field">
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
          <div className="eight wide field">
            <div className="ui fluid action input">
              <input
                type="text"
                name="idea"
                autoFocus
                ref={(input) => { this.ideaInput = input }}
                value={this.state.body}
                onChange={this.handleIdeaChange}
                placeholder="we're actively trying to improve"
              />
              <button
                type="submit"
                disabled={disabled}
                className="ui teal button"
              >
                Submit
              </button>
            </div>
          </div>
          <div className="ui toggle checkbox field">
            <input type="checkbox" onChange={this.handleToggleChange} id="action-item-toggle" />
            <label htmlFor="action-item-toggle">Toggle Action Items</label>
          </div>
        </div>
      </form>
    )
  }
}

IdeaSubmissionForm.propTypes = {
  onIdeaSubmission: React.PropTypes.func.isRequired,
  onToggleActionItem: React.PropTypes.func.isRequired,
}

export default IdeaSubmissionForm
