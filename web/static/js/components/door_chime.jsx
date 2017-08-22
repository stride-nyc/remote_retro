import React, { Component } from "react"
import * as AppPropTypes from "../prop_types"
import chimeSound from "./chime_sound"

class DoorChime extends Component {
  componentDidMount() {
    this.audio.volume = 0.15

    const timeout = setTimeout(() => {
      this.audio.muted = false
      clearTimeout(timeout)
    }, 1500)
  }

  componentWillReceiveProps(nextProps) {
    const userCountChanged = (this.props.users.length !== nextProps.users.length)
    if (userCountChanged && this.audio.readyState) { this.audio.play() }
  }

  render() {
    return (
      <audio
        muted
        src={chimeSound}
        ref={audio => (this.audio = audio)}
      />
    )
  }
}

DoorChime.propTypes = {
  users: AppPropTypes.users.isRequired,
}

export default DoorChime

