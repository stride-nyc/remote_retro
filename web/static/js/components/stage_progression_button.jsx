import React, { Component } from "react"
import Modal from "react-modal"
import * as AppPropTypes from "../prop_types"

class StageProgressionButton extends Component {
  constructor(props) {
    super(props)
    this.handleStageProgression = this.handleStageProgression.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
    this.handleStageProgressionButtonClick = this.handleStageProgressionButtonClick.bind(this)
    this.state = { modalOpen: false }
  }

  handleStageProgressionButtonClick() {
    const { config } = this.props
    const noConfirmationNecessary = !config.confirmationMessage
    if (noConfirmationNecessary) {
      this.handleStageProgression()
    } else {
      this.setState({ modalOpen: true })
    }
  }

  handleStageProgression() {
    const { config, retroChannel } = this.props

    retroChannel.push("proceed_to_next_stage", { stage: config.nextStage })
    this.setState({ modalOpen: false })
  }

  handleModalClose() {
    this.setState({ modalOpen: false })
  }

  render() {
    const { button, confirmationMessage } = this.props.config
    const { modalOpen } = this.state

    return (
      <div>
        <Modal
          contentLabel="Modal"
          isOpen={modalOpen}
          className="ui small modal visible transition fade in active"
        >
          <div className="content">
            <p>{confirmationMessage}</p>
          </div>
          <div className="actions" ref={ref => { this.modalActionsRef = ref }}>
            <button
              className="ui negative button"
              id="no"
              onClick={this.handleModalClose}
            >
              No
            </button>
            <button
              className="ui positive button"
              id="yes"
              onClick={this.handleStageProgression}
            >
              Yes
            </button>
          </div>
        </Modal>
        <button
          className="fluid ui right labeled teal icon button"
          onClick={this.handleStageProgressionButtonClick}
        >
          { button.copy }
          <i className={`${button.iconClass} icon`} />
        </button>
      </div>
    )
  }
}

StageProgressionButton.propTypes = {
  retroChannel: AppPropTypes.retroChannel.isRequired,
  config: React.PropTypes.object.isRequired,
}

export default StageProgressionButton
