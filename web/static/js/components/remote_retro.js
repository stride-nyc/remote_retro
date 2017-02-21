import React, { Component } from "react"
import { Presence } from "phoenix"

import RetroChannel from "../services/retro_channel"
import UserForm from "./user_form"
import Room from "./room"

import UrlHelpers from "../services/url_helpers"

class RemoteRetro extends Component {
  constructor(props) {
    super(props)
    this.state = { presences: {}, retroChannel: {} }

    this.handleSubmitUsername = this.handleSubmitUsername.bind(this)
  }

  handleSubmitUsername(username) {
    const retroUUID = UrlHelpers.parseRetroUUID(location.pathname)
    const retroChannel = RetroChannel.configure({ username, retroUUID })

    retroChannel.on("presence_state", state => {
      const presences = Presence.syncState(this.state.presences, state)
      this.setState({ presences, retroChannel })
    })

    retroChannel.on("presence_diff", diff => {
      const presences = Presence.syncDiff(this.state.presences, diff)
      this.setState({ presences, retroChannel })
    })

    retroChannel.join()
    this.setState({ username, retroChannel })
  }

  render() {
    const users = Presence.list(this.state.presences, (username, presence) => {
      return presence.user
    })

    if (this.state.username) {
      return <Room users={ users } retroChannel={ this.state.retroChannel } />
    } else {
      return <UserForm onSubmitUsername={this.handleSubmitUsername} />
    }
  }
}

export default RemoteRetro
