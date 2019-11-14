import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import isEmpty from "lodash/isEmpty"

import PropTypes from "prop-types"
import Modal from "react-modal"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/stage_progression_button.css"
import { actions as actionCreators } from "../redux"
import { VOTE_LIMIT } from "../configs/retro_configs"


export class StageProgressionButton extends Component {
  state = { modalOpen: false }

  handleStageProgressionButtonClick = () => {
    this.setState({ modalOpen: true })
  }

  handleStageProgression = () => {
    const { config, actions, reduxState } = this.props
    const { nextStage, optionalParamsAugmenter } = config

    const additionalParams = optionalParamsAugmenter ? optionalParamsAugmenter(reduxState) : {}

    actions.updateRetroAsync({ stage: nextStage, ...additionalParams })
  }

  handleModalClose = () => {
    this.setState({ modalOpen: false })
  }

  render() {
    const {
      buttonDisabled,
      className,
      currentUser,
      presences,
      retroUpdateRequested,
      config,
      votes,
    } = this.props

    const { modalOpen } = this.state
    const showAllVotesInPrompt = !isEmpty(presences)
      && (votes.length >= VOTE_LIMIT * presences.length)

    if (!config || !currentUser.is_facilitator) return null

    return (
      <div className={`${className} ${styles.index}`}>
        <Modal
          contentLabel="Modal"
          isOpen={modalOpen}
          className="ui tiny modal visible transition fade in active"
        >
          <div className="content">
            <p>{config.confirmationMessage}</p>
          </div>
          <div className="actions" ref={ref => { this.modalActionsRef = ref }}>
            <button
              className={`ui negative ${retroUpdateRequested ? "disabled" : ""} button`}
              id="no"
              type="button"
              onClick={this.handleModalClose}
            >
              No
            </button>
            <button
              autoFocus
              className={`ui positive ${retroUpdateRequested ? "loading" : ""} button`}
              id="yes"
              type="button"
              onClick={this.handleStageProgression}
            >
              Yes
            </button>
          </div>
        </Modal>
        { showAllVotesInPrompt && (
          <div className={`${styles.pointingLabel} floating ui pointing below teal label`}>
            All votes in!
          </div>
        )}
        <button
          className="fluid ui right labeled blue icon button"
          onClick={this.handleStageProgressionButtonClick}
          disabled={buttonDisabled}
          type="button"
        >
          { config.copy }
          <i className={`${config.iconClass} icon`} />
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
  reduxState: PropTypes.object,
  buttonDisabled: PropTypes.bool,
  presences: AppPropTypes.presences,
  retroUpdateRequested: PropTypes.bool,
  votes: AppPropTypes.votes.isRequired,
}

StageProgressionButton.defaultProps = {
  className: "",
  buttonDisabled: false,
  presences: [],
  retroUpdateRequested: false,
  reduxState: {},
  config: null,
}

const mapStateToProps = reduxState => ({
  reduxState,
  retroUpdateRequested: reduxState.retro.updateRequested,
  votes: reduxState.votes,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StageProgressionButton)
