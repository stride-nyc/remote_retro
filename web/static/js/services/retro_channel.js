import { Socket, Presence } from "phoenix"

import UserActivity from "./user_activity"

class RetroChannel {
  static configure({ userToken, retroUUID }) {
    const socket = new Socket("/socket", { params: { userToken } })
    socket.connect()

    return socket.channel(`retro:${retroUUID}`)
  }
}

export const applyListenersWithDispatch = (retroChannel, store, actions) => {
  retroChannel.on("presence_state", presences => {
    const users = Presence.list(presences, (_username, presence) => (presence.user))
    actions.setPresences(users)
  })

  retroChannel.on("presence_diff", actions.syncPresenceDiff)
  retroChannel.on("idea_committed", actions.addIdea)

  retroChannel.on("retro_edited", actions.updateRetroSync)

  retroChannel.on("idea_edit_state_enabled", ({ id }) => {
    actions.updateIdea(id, { inEditState: true, isLocalEdit: false })
  })

  retroChannel.on("idea_edit_state_disabled", disabledIdea => {
    actions.updateIdea(disabledIdea.id, { inEditState: false, liveEditText: null })
  })

  retroChannel.on("idea_live_edit", editedIdea => {
    actions.updateIdea(editedIdea.id, editedIdea)
  })

  retroChannel.on("idea_edited", editedIdea => {
    const updatedIdea = { ...editedIdea, inEditState: false, liveEditText: null }
    actions.updateIdea(editedIdea.id, updatedIdea)
  })

  retroChannel.on("idea_deleted", deletedIdea => {
    actions.deleteIdea(deletedIdea.id)
  })

  retroChannel.on("vote_submitted", actions.addVote)

  retroChannel.on("idea_highlight_toggled", highlightedIdea => {
    actions.updateIdea(highlightedIdea.id, { isHighlighted: !highlightedIdea.isHighlighted })
  })

  retroChannel.on("idea_typing_event", ({ userToken }) => {
    actions.updatePresence(userToken, { is_typing: true, last_typed: Date.now() })
    UserActivity.checkIfDoneTyping(store, userToken, () => {
      actions.updatePresence(userToken, { is_typing: false })
    })
  })

  return retroChannel
}

export default RetroChannel
