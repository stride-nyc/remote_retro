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
    const { presences } = this.state
    const { userToken } = this.props
    const hasPresences = Object.keys(presences).length > 0
    const currentUser = hasPresences ? presences[userToken].user.given_name : false
    const users = Presence.list(presences, (_username, presence) => presence.user)

    return <Room currentUser={currentUser} users={users} retroChannel={this.props.retroChannel} />
  }
}


RemoteRetro.propTypes = {
  userToken: React.PropTypes.string.isRequired,
  retroUUID: React.PropTypes.string.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
}

export default RemoteRetro
