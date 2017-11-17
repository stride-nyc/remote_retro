import React, { Component } from "react"
import * as AppPropTypes from "../prop_types"
import enterSound from "./enter_sound"
import exitSound from "./exit_sound"

class DoorChime extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sound: enterSound,
    }
  }
  componentDidMount() {
    this.audio.volume = 0.15

    const timeout = setTimeout(() => {
      this.audio.muted = false
      clearTimeout(timeout)
    }, 1500)
  }

  componentWillReceiveProps(nextProps) {
    const userCountIncreased = this.props.users.length < nextProps.users.length
    const userCountDecreased = this.props.users.length > nextProps.users.length
    const playAudio = () => this.audio.play()

    if (userCountIncreased && this.audio.readyState) {
      this.setState({ sound: enterSound }, playAudio)
    } else if (userCountDecreased && this.audio.readyState) {
      this.setState({ sound: exitSound }, playAudio)
    }
  }

  render() {
    return (
      <audio
        muted
        src={this.state.sound}
        ref={audio => { this.audio = audio }}
      />
    )
  }
}

DoorChime.propTypes = {
  users: AppPropTypes.users.isRequired,
}

export default DoorChime

