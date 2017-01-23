import SocketUtils from 'socket_utils'

import UserList from 'components/user_list'

import { Presence } from "phoenix"
import React from 'react'
import { render } from 'react-dom'

const user = prompt(`What's your name?`)
const socket = SocketUtils.establishWebsocketConnection(user)
const room = socket.channel("room:lobby")

let presences = {}
room.on("presence_state", state => {
  presences = Presence.syncState(presences, state)
  const users = Object.values(presences).map(presence => presence.user)

  render(<UserList users={ users }/>, document.querySelector('.react-root'))
})

room.on("presence_diff", diff => {
  presences = Presence.syncDiff(presences, diff)
  const users = Object.values(presences).map(presence => presence.user)

  render(<UserList users={ users }/>, document.querySelector('.react-root'))
})

room.join()

