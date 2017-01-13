import UserList from 'components/user_list'

import {Socket, Presence} from "phoenix"
import React from 'react'
import { render } from 'react-dom'

const user = prompt(`What's your name?`)
let socket = new Socket("/socket", {params: { user }})
socket.connect()

let room = socket.channel("room:lobby")

const usersSortedByArrivalAsc = (presences) => {
  let users = Object.keys(presences)
  return users.sort((userA, userB) => {
    const userAMetadata = presences[userA].metas[0]
    const userBMetadata = presences[userB].metas[0]
    return userAMetadata.online_at < userBMetadata.online_at ? -1 : 1
  })
}

let presences = {}
room.on("presence_state", state => {
  presences = Presence.syncState(presences, state)
  let users = usersSortedByArrivalAsc(presences)
  render(<UserList users={ users }/>, document.querySelector('.react-root'))
})

room.on("presence_diff", diff => {
  presences = Presence.syncDiff(presences, diff)
  let users = usersSortedByArrivalAsc(presences)
  render(<UserList users={ users }/>, document.querySelector('.react-root'))
})

room.join()

