import React, { Component } from "react"
import Modal from "react-modal"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import * as AppPropTypes from "../prop_types"
import * as alertActionCreators from "../actions/alert"

export class Alert extends Component {
  render() {
    if (!this.props.config) return null

    const { actions, config } = this.props
    const { headerText, bodyText } = config

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
          <button className="ui blue right floated button" onClick={actions.clearAlert}>
            Got it!
          </button>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  alertConfig: state.alertConfig,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(alertActionCreators, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Alert)
