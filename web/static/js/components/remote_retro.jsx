import React, { Component } from "react"
import { Presence } from "phoenix"

import * as AppPropTypes from "../prop_types"
import RetroChannel from "../services/retro_channel"
import Room from "./room"

class RemoteRetro extends Component {
  constructor(props) {
    super(props)
    this.state = {
      presences: {},
    }
  }

  componentWillMount() {
    this.props.retroChannel.on("presence_state", presences => this.setState({ presences }))
    this.props.retroChannel.join()
  }

  render() {
    const users = Presence.list(this.state.presences, (_username, presence) => presence.user)

    return <Room users={users} retroChannel={this.props.retroChannel} />
  }
}


RemoteRetro.propTypes = {
  retroChannel: AppPropTypes.retroChannel.isRequired,
}

export default RemoteRetro
