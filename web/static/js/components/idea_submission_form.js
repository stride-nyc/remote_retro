import React, { Component } from "react"

class IdeaSubmissionForm extends Component {
  constructor(props) {
    super(props)
    this.state = { ideaText: "", ideaCategory: "" }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleIdeaChange = this.handleIdeaChange.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()
    this.setState({ ideaText: "" })
    this.props.onIdeaSubmission(this.state.ideaText)
  }

  handleIdeaChange(event) {
    const newState = { ...this.state, ideaText: event.target.value }
    this.setState(newState)
  }

  handleCategoryChange(event) {
    const newState = { ...this.state, ideaCategory: event.target.value }
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
                   value={ this.state.ideaCategory }
                   onChange={ this.handleCategoryChange }
                   placeholder="happy"/>
          </div>
          <div className="five wide field">
            <div className="ui fluid action input">
              <input type="text"
                     name="idea"
                     value={ this.state.ideaText }
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
