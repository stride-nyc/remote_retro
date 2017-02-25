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
      retroUUID: UrlHelpers.parseRetroUUID(location.pathname),
    }
  }

  componentWillMount() {
    const retroChannel = RetroChannel.configure({
      token: window.token,
      retroUUID: this.state.retroUUID,
    })

    retroChannel.on("presence_state", (state) => {
      this.setState({ presences: Presence.syncState(this.state.presences, state) })
    })

    retroChannel.on("presence_diff", (diff) => {
      this.setState({ presences: Presence.syncDiff(this.state.presences, diff) })
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
