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
      <form onSubmit={ this.handleSubmit }>
        <input type="text"
               tabIndex="0"
               name="idea"
               value={ this.state.ideaText }
               onChange={ this.handleChange }
               placeholder=":happy: we're actively trying to improve"/>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

IdeaSubmissionForm.propTypes = {
  onIdeaSubmission: React.PropTypes.func.isRequired,
}

export default IdeaSubmissionForm
