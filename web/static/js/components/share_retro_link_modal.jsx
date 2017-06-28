import React, { Component } from "react"
import Modal from "react-modal"

const timeElapsedLessThanFiveSec = retroCreationTimestamp => {
  const millisecondsSinceRetroCreation = new Date(retroCreationTimestamp)
  const timeElapsedSinceRetroCreation = new Date().getTime() - millisecondsSinceRetroCreation
  return (timeElapsedSinceRetroCreation < 5000)
}

class ShareRetroLinkModal extends Component {
  constructor(props) {
    super(props)
    this.closeModal = this.closeModal.bind(this)
    this.setCurrentInput = this.setCurrentInput.bind(this)
    this.handleCopyLink = this.handleCopyLink.bind(this)
    this.state = {
      closedByUser: false,
      shouldOpen: timeElapsedLessThanFiveSec(props.retroCreationTimestamp),
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
    const { copyLinkInput } = this.state

    copyLinkInput.select()
    document.execCommand('copy')
  }

  setCurrentInput(input) {
    this.setState({copyLinkInput: input})
  }

  render() {
    const { closedByUser, shouldOpen } = this.state
    const hasntBeenClosed = !closedByUser

    return (
      <Modal
        contentLabel="Share Retro Link"
        isOpen={hasntBeenClosed && shouldOpen}
        className="ui small modal visible transition fade in active"
        onRequestClose={this.closeModal}
      >
        <div className="ui basic padded segment">
          <button
            className="ui basic compact right floated icon button"
            onClick={this.closeModal}
          >
            <i className="close icon" />
          </button>
          <div className="ui center aligned header">
            <p>
              <i className="big icons">
                <i className="user icon" />
                <i className="corner announcement icon" />
              </i>
            </p>
            Share the unique retro link below with teammates!
          </div>
          <div className="ui fluid input">
            <input
              ref={this.setCurrentInput}
              readOnly
              className="ui input"
              type="text"
              value={window.location}
            />
          </div>
          <div className="ui basic center aligned segment">
            <button className="ui labeled teal icon button" onClick={this.handleCopyLink}>
              <i className="copy icon" />
              Copy Link to Clipboard
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
  retroCreationTimestamp: React.PropTypes.string
}

export default ShareRetroLinkModal
