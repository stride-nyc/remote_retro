import React, { Component } from "react"
import Modal from "react-modal"

import styles from "./css_modules/share_retro_link_modal.css"

const timeElapsedLessThanFiveSec = retroCreationTimestamp => {
  const millisecondsSinceRetroCreation = new Date(retroCreationTimestamp)
  const timeElapsedSinceRetroCreation = new Date().getTime() - millisecondsSinceRetroCreation
  return (timeElapsedSinceRetroCreation < 5000)
}

class ShareRetroLinkModal extends Component {
  constructor(props) {
    super(props)
    this.closeModal = this.closeModal.bind(this)
    this.handleCopyLink = this.handleCopyLink.bind(this)
    this.state = {
      closedByUser: false,
      shouldOpen: timeElapsedLessThanFiveSec(props.retroCreationTimestamp),
      buttonClicked: false,
    }
  }

  componentWillReceiveProps({ retroCreationTimestamp }) {
    if (timeElapsedLessThanFiveSec(retroCreationTimestamp)) {
      this.setState({ shouldOpen: true })
    }
  }

  closeModal() {
    this.setState({ closedByUser: true })
  }

  handleCopyLink() {
    this.input.select()
    document.execCommand("copy")
    this.setState({ buttonClicked: true })
  }

  render() {
    const { closedByUser, shouldOpen } = this.state
    const hasntBeenClosed = !closedByUser
    let copyButtonText = this.state.buttonClicked ? "Copied!" : "Copy Link to Clipboard"
    let copyButtonClass = this.state.buttonClicked ? "ui positive button" : ""

    return (
      <Modal
        contentLabel="Share Retro Link"
        isOpen={hasntBeenClosed && shouldOpen}
        className="ui small modal visible transition fade in active"
        onRequestClose={this.closeModal}
      >
        <div className="ui basic padded segment">
          <div>
            <button
              className="ui basic compact right floated icon button"
              onClick={this.closeModal}
            >
              <i className="close icon" />
            </button>
          </div>
          <div className="ui center aligned header">
            <p>
              <i className={`big external share icon ${styles.shareIcon}`} />
            </p>
            Share the unique retro link below with teammates!
          </div>
          <div className="ui fluid input">
            <input
              ref={input => { this.input = input }}
              readOnly
              className="ui input"
              type="text"
              value={window.location}
            />
          </div>
          <div className="ui basic center aligned segment">
            <button className={"ui labeled teal icon button " + copyButtonClass} onClick={this.handleCopyLink}>
              <i className="copy icon" />
              {copyButtonText}
            </button>
          </div>
        </div>
      </Modal>
    )
  }
}

ShareRetroLinkModal.defaultProps = {
  retroCreationTimestamp: null,
}

ShareRetroLinkModal.propTypes = {
  retroCreationTimestamp: React.PropTypes.string,
}

export default ShareRetroLinkModal
