import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import Modal from "react-modal"

import { actions as actionCreators } from "../redux"

export class Error extends Component {
  render() {
    if (!this.props.config) return null

    const { actions, config } = this.props

    return (
      <Modal
        className="ui tiny modal visible transition fade in"
        label="Error"
        isOpen
      >
        <div className="ui negative message">
          <i className="close icon" onClick={actions.clearError} />
          <div className="header">
            Server Error
          </div>
          <p autoFocus>{config.message}</p>
        </div>
      </Modal>
    )
  }
}

Error.propTypes = {
  actions: PropTypes.object,
  config: PropTypes.object,
}

Error.defaultProps = {
  actions: {},
  config: null,
}

const mapStateToProps = state => ({
  config: state.error,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Error)
