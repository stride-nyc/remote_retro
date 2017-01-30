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
      <form onSubmit={ this.handleSubmit } className="ui form">
        <div className="inline fields">
          <div className="ten wide field">
            <input type="text"
                   autoFocus
                   name="idea"
                   value={ this.state.ideaText }
                   onChange={ this.handleChange }
                   placeholder=":happy: we're actively trying to improve"/>
          </div>
          <div className="two wide field">
            <input type="submit" value="Submit" className="ui button"/>
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
