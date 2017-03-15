import React, { Component, PropTypes } from "react"
import { Presence } from "phoenix"

import * as AppPropTypes from "../prop_types"
import Room from "./room"

const isFacilitator = (currentPresence) => {
  if (currentPresence) {
    return currentPresence.user.facilitator
  }

  return false
}

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
    const { userToken, retroChannel } = this.props
    const { presences } = this.state

    const users = Presence.list(presences, (_username, presence) => (presence.user))
    const currentPresence = presences[userToken]

    return (
      <Room
        users={users}
        isFacilitator={isFacilitator(currentPresence)}
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
