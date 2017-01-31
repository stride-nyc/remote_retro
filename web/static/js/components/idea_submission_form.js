import React, { Component } from "react"

class IdeaSubmissionForm extends Component {
  constructor(props) {
    super(props)
    this.state = { body: "", category: "" }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleIdeaChange = this.handleIdeaChange.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()
    this.setState({ body: "" })
    this.props.onIdeaSubmission(this.state)
  }

  handleIdeaChange(event) {
    const newState = { ...this.state, body: event.target.value }
    this.setState(newState)
  }

  handleCategoryChange(event) {
    const newState = { ...this.state, category: event.target.value }
    this.setState(newState)
  }

  render() {
    return (
      <form onSubmit={ this.handleSubmit } className="ui form basic attached center aligned secondary segment">
        <div className="inline fields">
          <div className="two wide field">
            <label htmlFor="category">@</label>
            <input type="text"
                   autoFocus
                   name="category"
                   value={ this.state.category }
                   onChange={ this.handleCategoryChange }
                   placeholder="happy"/>
          </div>
          <div className="five wide field">
            <div className="ui fluid action input">
              <input type="text"
                     name="idea"
                     value={ this.state.body }
                     onChange={ this.handleIdeaChange }
                     placeholder="we're actively trying to improve"/>
              <button type="submit" className="ui teal button">Submit</button>
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
