import React, { Component } from "react"
import { Socket, Presence } from "phoenix"
import values from "lodash/values"

import UserForm from "./user_form"
import Room from "./room"

class RemoteRetro extends Component {
  constructor(props) {
    super(props)
    this.state = { users: [] }

    this.handleSubmitUsername = this.handleSubmitUsername.bind(this)
  }

  handleSubmitUsername(user) {
    let socket = new Socket("/socket", {params: { user }})
    socket.connect()
    let presences = {}

    const room = socket.channel("room:lobby")

    room.on("presence_state", state => {
      presences = Presence.syncState(presences, state)
      const users = values(presences).map(presence => presence.user)
      this.setState({ users })
    })

    room.on("presence_diff", diff => {
      presences = Presence.syncDiff(presences, diff)
      const users = values(presences).map(presence => presence.user)
      this.setState({ users })
    })

    room.join()
    this.setState({ user })
  }

  render() {
    const user = this.state.user

    let content
    if (user) {
      content = <Room users={ this.state.users } />
    } else {
      content = <UserForm onSubmitUsername={this.handleSubmitUsername} />
    }

    return <div>{ content }</div>
  }
}

export default RemoteRetro
