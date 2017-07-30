import React, { Component } from "react"
import Modal from "react-modal"

import * as AppPropTypes from "../prop_types"

class Alert extends Component {
  render() {
    if (!this.props.config) return null

    const { headerText, bodyText } = this.props.config

    return (
      <Modal
        className="ui tiny modal visible transition fade in active"
        contentLabel="Alert"
        isOpen
      >
        <div className="ui basic padded clearing segment">
          <p className="ui dividing header">
            {headerText}
          </p>
          <div className="ui content">
            {bodyText}
          </div>
          <br/>
          <button className="ui blue right floated button">Got it!</button>
        </div>
      </Modal>
    )
  }
}

Alert.propTypes = {}

export default Alert
