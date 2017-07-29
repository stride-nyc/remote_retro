import React, { Component } from "react"
import Modal from "react-modal"
import classNames from "classnames"

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
    const { closedByUser, shouldOpen, buttonClicked } = this.state
    const hasntBeenClosed = !closedByUser
    const copyButtonClasses = classNames(
      "ui",
      "labeled",
      "teal",
      "icon",
      "button",
      {
        positive: buttonClicked,
        [styles.buttonCopy]: true,
      }
    )

    return (
      <Modal
        contentLabel="Share Retro Link"
        isOpen={hasntBeenClosed && shouldOpen}
        className="ui small modal visible transition fade in active"
        onRequestClose={this.closeModal}
      >
        <div className="ui basic padded center aligned segment">
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
          <div className={`ui input ${styles.textInputWrapper}`}>
            <input
              ref={input => { this.input = input }}
              readOnly
              autoFocus
              className={`ui input ${styles.input}`}
              type="text"
              value={window.location}
            />
          </div>
          <div className="ui basic center aligned segment">
            <button className={copyButtonClasses} onClick={this.handleCopyLink}>
              <i className={`icon ${buttonClicked ? "checkmark" : "copy"}`} />
              { buttonClicked ? "Copied!" : "Copy Link to Clipboard" }
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
