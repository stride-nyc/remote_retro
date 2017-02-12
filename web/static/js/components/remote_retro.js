import React, { Component } from "react"
import { Socket, Presence } from "phoenix"
import values from "lodash/values"

import UserForm from "./user_form"
import Room from "./room"

import UrlHelpers from "../services/url_helpers"

class RemoteRetro extends Component {
  constructor(props) {
    super(props)
    this.state = { users: [], retroChannel: {} }

    this.handleSubmitUsername = this.handleSubmitUsername.bind(this)
  }

  handleSubmitUsername(user) {
    let socket = new Socket("/socket", {params: { user }})
    socket.connect()
    let presences = {}

    const retroUUID = UrlHelpers.parseRetroUUID(location.pathname)
    const retroChannel = socket.channel("retro:" + retroUUID)

    retroChannel.on("presence_state", state => {
      presences = Presence.syncState(presences, state)
      const users = values(presences).map(presence => presence.user)
      this.setState({ users, retroChannel })
    })

    retroChannel.on("presence_diff", diff => {
      presences = Presence.syncDiff(presences, diff)
      const users = values(presences).map(presence => presence.user)
      this.setState({ users, retroChannel })
    })

    retroChannel.join()
    this.setState({ user, retroChannel })
  }

  render() {
    const user = this.state.user

    let content
    if (user) {
      return <Room users={ this.state.users } retroChannel={ this.state.retroChannel } />
    } else {
      return <UserForm onSubmitUsername={this.handleSubmitUsername} />
    }
  }
}

export default RemoteRetro
