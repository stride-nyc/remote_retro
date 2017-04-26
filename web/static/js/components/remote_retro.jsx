import React, { Component, PropTypes } from "react"
import { Presence } from "phoenix"

import * as AppPropTypes from "../prop_types"
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
      .receive("error", error => console.error(error))
  }

  render() {
    const { userToken, retroChannel } = this.props
    const { presences } = this.state

    const users = Presence.list(presences, (_username, presence) => (presence.user))
    const currentPresence = presences[userToken]

    return (
      <Room
        currentPresence={currentPresence}
        users={users}
        retroChannel={retroChannel}
      />
    )
  }
}

RemoteRetro.propTypes = {
  retroChannel: AppPropTypes.retroChannel.isRequired,
  userToken: PropTypes.string.isRequired,
}

export default RemoteRetro
