import React from "react"
import PropTypes from "prop-types"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import Modal from "react-modal"

import { actions as actionCreators } from "../redux"

export const Error = props => {
  const { actions, config } = props

  if (!config) return null

  return (
    <Modal
      className="ui tiny modal visible transition fade in"
      label="Error"
      isOpen
    >
      <div className="ui negative message">
        <i
          className="close icon"
          onClick={actions.clearError}
          onKeyPress={actions.clearError}
        />
        <div className="header">
          Server Error
        </div>
        <p>{config.message}</p>
      </div>
    </Modal>
  )
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
