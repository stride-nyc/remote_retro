import React, { Component } from "react"

class IdeaSubmissionForm extends Component {
  constructor(props) {
    super(props)
    this.state = { body: "", category: "happy" }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleIdeaChange = this.handleIdeaChange.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()
    this.setState({ body: "" })
    this.categoryInput.focus()
    this.props.onIdeaSubmission(this.state)
  }

  handleIdeaChange(event) {
    const newState = { ...this.state, body: event.target.value }
    this.setState(newState)
  }

  handleCategoryChange(event) {
    const newState = { ...this.state, category: event.target.value }
    this.ideaInput.focus()
    this.setState(newState)
  }

  render() {
    const disabled = this.state.body.length < 3

    return (
      <form onSubmit={ this.handleSubmit } className="ui form basic attached center aligned secondary segment">
        <div className="inline fields">
          <div className="two wide field">
            <label htmlFor="category">Category:</label>
            <select name="category"
                    autoFocus
                    ref={ input => { this.categoryInput = input }}
                    value={ this.state.category }
                    onChange={ this.handleCategoryChange } >
              <option value="happy">happy</option>
              <option value="sad">sad</option>
              <option value="confused">confused</option>
            </select>
          </div>
          <div className="five wide field">
            <div className="ui fluid action input">
              <input type="text"
                     name="idea"
                     ref={ input => { this.ideaInput = input }}
                     value={ this.state.body }
                     onChange={ this.handleIdeaChange }
                     placeholder="we're actively trying to improve"/>
              <button type="submit"
                      disabled={ disabled }
                      className="ui teal button">Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

IdeaSubmissionForm.propTypes = {
  onIdeaSubmission: React.PropTypes.func.isRequired,
}

export default IdeaSubmissionForm
