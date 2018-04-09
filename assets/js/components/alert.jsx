import React, { Component } from "react"
import PropTypes from "prop-types"
import Modal from "react-modal"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import { actions as actionCreators } from "../redux"

Modal.defaultStyles.content.zIndex = 2
Modal.defaultStyles.overlay.zIndex = 2
Modal.setAppElement("body")

export class Alert extends Component {

  render() {
    if (!this.props.config) return null

    const { actions, config } = this.props
    const { headerText, BodyComponent } = config

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
            <BodyComponent />
          </div>
          <br />
          <button autoFocus className="ui blue right floated button" onClick={actions.clearAlert}>
            Got it!
          </button>
        </div>
      </Modal>
    )
  }
}

Alert.propTypes = {
  actions: PropTypes.object,
  config: PropTypes.object,
}

Alert.defaultProps = {
  actions: {},
  config: null,
}

const mapStateToProps = state => ({
  alert: state.alert,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Alert)
