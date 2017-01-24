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
    this.props.submitAction(this.state.username)
    event.preventDefault()
  }

  render(){
    return (
      <section>
        <p>Welcome to Remote Retro! What's your name?</p>
        <form onSubmit={this.handleSubmit} >
          <input type="text" value={this.state.username} onChange={this.handleChange} />
          <input type="submit" value="Submit" />
        </form>
      </section>
    )
  }
}

export default UserForm
