import { Socket } from "phoenix"

class RetroChannel {
  static configure(config) {
    const socket = new Socket("/socket", { params: { userToken: config.userToken } })
    socket.connect()

    const retroChannel = socket.channel(`retro:${config.retroUUID}`)
    return retroChannel
  }

  static triggerTimeoutForOwnIdea(component, idea, callback, duration) {
    const { userToken, users } = component.props
    const currentUser = users.find(user => user.token === userToken)
    if (idea.user_id === currentUser.id) {
      setTimeout(callback, duration)
    }
  }
}


export default RetroChannel
