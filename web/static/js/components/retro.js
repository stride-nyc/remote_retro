import React, { Component } from "react"
import { Socket, Presence } from "phoenix"

import UserForm from "./user_form"
import UserList from "./user_list"

class Retro extends Component {
  constructor(props) {
    super(props)
    this.state = { users: [] }

    this.setUser = this.setUser.bind(this)
  }

  setUser(user) {
    let socket = new Socket("/socket", {params: { user }})
    socket.connect()
    let presences = {}

    const room = socket.channel("room:lobby")

    room.on("presence_state", state => {
      presences = Presence.syncState(presences, state)
      const users = Object.values(presences).map(presence => presence.user)
      this.setState({ users })
    })

    room.on("presence_diff", diff => {
      presences = Presence.syncDiff(presences, diff)
      const users = Object.values(presences).map(presence => presence.user)
      this.setState({ users })
    })

    room.join()
    this.setState({ user })
  }

  render() {
    const user = this.state.user

    let content
    if (user) {
      content = <UserList users={ this.state.users }/>
    } else {
      content = <UserForm submitAction={this.setUser} />
    }

    return <div>{ content }</div>
  }
}

export default Retro
