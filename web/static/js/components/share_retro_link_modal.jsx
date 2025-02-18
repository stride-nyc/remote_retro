import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import Modal from "react-modal"
import classNames from "classnames"

import styles from "./css_modules/share_retro_link_modal.css"

const timeElapsedLessThanFiveSec = retroCreationTimestamp => {
  const millisecondsSinceRetroCreation = new Date(retroCreationTimestamp)
  const timeElapsedSinceRetroCreation = new Date().getTime() - millisecondsSinceRetroCreation
  return (timeElapsedSinceRetroCreation < 7500)
}

export class ShareRetroLinkModal extends Component {
  constructor(props) {
    super(props)
    const { retroCreationTimestamp = null } = props
    this.closeModal = this.closeModal.bind(this)
    this.handleCopyLink = this.handleCopyLink.bind(this)
    this.state = {
      closedByUser: false,
      shouldOpen: timeElapsedLessThanFiveSec(retroCreationTimestamp),
      buttonClicked: false,
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps({ retroCreationTimestamp }) {
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
        className={`ui small modal visible active ${styles.index}`}
      >
        <div className="ui basic padded center aligned segment">
          <div>
            <button
              className="ui basic compact right floated icon button"
              type="button"
              onClick={this.closeModal}
            >
              <i className="close icon" />
            </button>
          </div>
          <div className="ui center aligned header">
            <p>
              <i className={`big external share icon ${styles.shareIcon}`} />
            </p>
            Share the retro link below with teammates!
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
            <button
              className={copyButtonClasses}
              onClick={this.handleCopyLink}
              type="button"
            >
              <i className={`icon ${buttonClicked ? "checkmark" : "copy"}`} />
              { buttonClicked ? "Copied!" : "Copy Link to Clipboard" }
            </button>
          </div>
        </div>
      </Modal>
    )
  }
}

ShareRetroLinkModal.propTypes = {
  retroCreationTimestamp: PropTypes.string.isRequired,
}

const mapStateToProps = ({ retro }) => ({
  retroCreationTimestamp: retro.inserted_at,
})

export default connect(
  mapStateToProps
)(ShareRetroLinkModal)
