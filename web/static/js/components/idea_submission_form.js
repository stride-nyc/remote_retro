import React, { Component } from "react"

class IdeaSubmissionForm extends Component {
  constructor(props) {
    super(props)
    this.state = { ideaText: "" }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()
    this.setState({ ideaText: "" })
    this.props.onIdeaSubmission(this.state.ideaText)
  }

  handleChange(event) {
    this.setState({ ideaText: event.target.value })
  }

  render() {
    return (
      <form onSubmit={ this.handleSubmit } className="ui form basic segment">
        <div className="ui fluid action input">
          <input type="text"
                 autoFocus
                 name="idea"
                 value={ this.state.ideaText }
                 onChange={ this.handleChange }
                 placeholder=":happy: we're actively trying to improve"/>
          <button type="submit" className="ui button">Submit</button>
        </div>
      </form>
    )
  }
}

IdeaSubmissionForm.propTypes = {
  onIdeaSubmission: React.PropTypes.func.isRequired,
}

export default IdeaSubmissionForm
