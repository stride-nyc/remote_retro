import UserList from 'components/user_list'

import React from 'react'
import { render } from 'react-dom'


import {Socket, Presence} from "phoenix"

const user = prompt(`What's your name?`)

let socket = new Socket("/socket", {params: {user: user }})
socket.connect()

let room = socket.channel("room:lobby")

let presences = {}
room.on("presence_state", state => {
  presences = Presence.syncState(presences, state)
  const users = Object.keys(presences)
  render(<UserList users={ users }/>, document.querySelector('.react-root'))
})

room.on("presence_diff", diff => {
  presences = Presence.syncDiff(presences, diff)
  const users = Object.keys(presences)
  render(<UserList users={ users }/>, document.querySelector('.react-root'))
})

room.join()

