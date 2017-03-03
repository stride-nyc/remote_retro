import React, { Component } from "react"
import { Presence } from "phoenix"

import RetroChannel from "../services/retro_channel"
import Room from "./room"

import UrlHelpers from "../services/url_helpers"

class RemoteRetro extends Component {
  constructor(props) {
    super(props)
    this.state = {
      presences: {},
      retroChannel: {},
      token: window.token,
      retroUUID: UrlHelpers.parseRetroUUID(location.pathname),
    }
  }

  componentWillMount() {
    const retroChannel = RetroChannel.configure(this.state)

    retroChannel.on("presence_state", presences => {
      this.setState({ presences })
    })

    retroChannel.join()
    this.setState({ retroChannel })
  }

  render() {
    const users = Presence.list(this.state.presences, (_username, presence) => presence.user)

    return <Room users={users} retroChannel={this.state.retroChannel} />
  }
}

export default RemoteRetro
