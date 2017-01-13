import { Socket } from "phoenix"

export default class SocketUtils {
  static establishWebsocketConnection(user) {
    let socket = new Socket("/socket", {params: { user }})
    socket.connect()

    return socket
  }
}
