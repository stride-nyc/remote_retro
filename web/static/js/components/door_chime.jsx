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
    const { presences } = this.props
    const presenceCountIncreased = presences.length < nextProps.presences.length
    const presenceCountDecreased = presences.length > nextProps.presences.length
    const attemptToPlayEnterExitSound = () => {
      const playPromise = this.audio.play()
      if (!playPromise) { return }

      playPromise
        .then(() => {})
        .catch(e => console.log(e))
    }

    if (presenceCountIncreased && this.audio.readyState) {
      this.setState({ sound: enterSound }, attemptToPlayEnterExitSound)
    } else if (presenceCountDecreased && this.audio.readyState) {
      this.setState({ sound: exitSound }, attemptToPlayEnterExitSound)
    }
  }

  render() {
    const { sound } = this.state

    return (
      <audio
        muted
        src={sound}
        ref={audio => { this.audio = audio }}
      />
    )
  }
}

DoorChime.propTypes = {
  presences: AppPropTypes.presences.isRequired,
}

export default DoorChime
