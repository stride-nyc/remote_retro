import React, { Component } from "react"
import { Presence } from "phoenix"

import RetroChannel from "../services/retro_channel"
import Room from "./room"

class RemoteRetro extends Component {
  constructor(props) {
    super(props)
    this.state = {
      presences: {},
      retroChannel: {},
    }
  }

  componentWillMount() {
    const channelConfiguration = { userToken, retroUUID } = this.props
    const retroChannel = RetroChannel.configure(channelConfiguration)

    retroChannel.on("presence_state", presences => this.setState({ presences }))

    retroChannel.join()
    this.setState({ retroChannel })
  }

  render() {
    const users = Presence.list(this.state.presences, (_username, presence) => presence.user)

    return <Room users={users} retroChannel={this.state.retroChannel} />
  }
}


RemoteRetro.propTypes = {
  retroUUID: React.PropTypes.string.isRequired,
  userToken: React.PropTypes.string.isRequired,
}

export default RemoteRetro
