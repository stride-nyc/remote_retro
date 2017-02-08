import React, { Component } from "react"

class UserForm extends Component {
  constructor(props) {
    super(props)
    this.state = { username: "" }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({ username: event.target.value })
  }

  handleSubmit(event) {
    this.props.onSubmitUsername(this.state.username)
    event.preventDefault()
  }

  render(){
    return (
      <section className="ui basic segment">
        <p className="ui header">Welcome to Remote Retro! What's your name?</p>
        <form onSubmit={this.handleSubmit} className="ui form">
          <div className="ui action input">
            <input type="text"
                   name="username"
                   autoFocus
                   value={this.state.username}
                   onChange={this.handleChange} />
            <button type="submit" className="ui button teal">Submit</button>
          </div>
        </form>
      </section>
    )
  }
}

UserForm.propTypes = {
  onSubmitUsername: React.PropTypes.func.isRequired
}

export default UserForm
