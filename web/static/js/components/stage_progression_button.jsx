import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import PropTypes from "prop-types"
import Modal from "react-modal"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/stage_progression_button.css"
import { actions as actionCreators } from "../redux"

export class StageProgressionButton extends Component {
  state = { modalOpen: false }

  handleStageProgressionButtonClick = () => {
    this.setState({ modalOpen: true })
  }

  handleStageProgression = () => {
    const { config, actions } = this.props

    actions.updateRetroAsync({ stage: config.nextStage })
  }

  handleModalClose = () => {
    this.setState({ modalOpen: false })
  }

  render() {
    const {
      buttonDisabled,
      className,
      currentUser,
      retroUpdateRequested,
      config: { progressionButton, confirmationMessage },
    } = this.props

    const { modalOpen } = this.state

    if (!progressionButton || !currentUser.is_facilitator) return null

    return (
      <div className={`${className} ${styles.index}`}>
        <Modal
          contentLabel="Modal"
          isOpen={modalOpen}
          className="ui tiny modal visible transition fade in active"
        >
          <div className="content">
            <p>{confirmationMessage}</p>
          </div>
          <div className="actions" ref={ref => { this.modalActionsRef = ref }}>
            <button
              className={`ui negative ${retroUpdateRequested ? "disabled" : ""} button`}
              id="no"
              onClick={this.handleModalClose}
            >
              No
            </button>
            <button
              autoFocus
              className={`ui positive ${retroUpdateRequested ? "loading" : ""} button`}
              id="yes"
              onClick={this.handleStageProgression}
            >
              Yes
            </button>
          </div>
        </Modal>
        <button
          className="fluid ui right labeled blue icon button"
          onClick={this.handleStageProgressionButtonClick}
          disabled={buttonDisabled}
        >
          { progressionButton.copy }
          <i className={`${progressionButton.iconClass} icon`} />
        </button>
      </div>
    )
  }
}

StageProgressionButton.propTypes = {
  actions: AppPropTypes.actions.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  className: PropTypes.string,
  config: PropTypes.object,
  buttonDisabled: PropTypes.bool,
  retroUpdateRequested: PropTypes.bool,
}

StageProgressionButton.defaultProps = {
  className: "",
  buttonDisabled: false,
  retroUpdateRequested: false,
  config: null,
}

const mapStateToProps = ({ retro }) => ({
  retroUpdateRequested: retro.updateRequested,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StageProgressionButton)
