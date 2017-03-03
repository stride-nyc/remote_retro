import React, { Component } from "react"

import chimeSound from "./chime_sound"

class DoorChime extends Component {
  componentDidMount() {
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
  users: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      name: React.PropTypes.string,
      online_at: React.PropTypes.number,
    }),
  ).isRequired,
}

export default DoorChime

