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
    const presenceCountIncreased = this.props.presences.length < nextProps.presences.length
    const presenceCountDecreased = this.props.presences.length > nextProps.presences.length
    const playAudio = () => this.audio.play()

    if (presenceCountIncreased && this.audio.readyState) {
      this.setState({ sound: enterSound }, playAudio)
    } else if (presenceCountDecreased && this.audio.readyState) {
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
  presences: AppPropTypes.presences.isRequired,
}

export default DoorChime

