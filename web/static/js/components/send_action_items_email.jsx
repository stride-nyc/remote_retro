import React, { Component } from "react"
const successMessage = "Consider it done. Participants will receive an email breakdown of the action items shortly."
const errorMessage   =  "It seems there was an error. Please try to send the action items again in a few minutes. Thanks for your patience."

class SendActionItemsEmail extends Component {
  constructor(props) {
    super(props)
    this.state = { disabled: false }
    this.sendActionItemsEmail = this.sendActionItemsEmail.bind(this)
  }

  sendActionItemsEmail() {
    this.setState({ disabled: true })
    this.props.retroChannel.push("send_action_items_email")
  }

  componentDidMount() {
    this.props.retroChannel.on("email_send_status", (payload) => {
      this.setState({ disabled: false })
      alert(payload.success ? successMessage : errorMessage)
    })
  }

  render() {
    return (
      <button className="ui right labeled teal icon button sendActionEmal" disabled={this.state.disabled} onClick={this.sendActionItemsEmail}>
        Send Action Items
        <i className="send icon"></i>
      </button>
    )
  }
}

SendActionItemsEmail.propTypes = {
  retroChannel: React.PropTypes.object.isRequired,
}

export default SendActionItemsEmail
