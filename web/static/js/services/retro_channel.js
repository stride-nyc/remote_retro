import { Socket, Presence } from "phoenix"

import UserActivity from "./user_activity"

class RetroChannel {
  static configure({ userToken, retroUUID, store, actions }) {
    const socket = new Socket("/socket", { params: { userToken } })
    socket.connect()

    const retroChannel = socket.channel(`retro:${retroUUID}`)

    return applyListenerCallbacks(retroChannel, store, actions)
  }
}

const applyListenerCallbacks = (retroChannel, store, actions) => {
  retroChannel.on("presence_state", presences => {
    const users = Presence.list(presences, (_username, presence) => (presence.user))
    actions.setUsers(users)
  })

  retroChannel.on("presence_diff", actions.syncPresenceDiff)
  retroChannel.on("new_idea_received", actions.addIdea)
  retroChannel.on("new_action_item_received", actions.addActionItem)

  retroChannel.on("proceed_to_next_stage", payload => {
    actions.updateStage(payload.stage)
  })

  retroChannel.on("enable_edit_state", ({ id, editorToken }) => {
    actions.updateIdea(id, { editing: true, editorToken })
  })

  retroChannel.on("disable_edit_state", disabledIdea => {
    actions.updateIdea(disabledIdea.id, { editing: false, liveEditText: null, editorToken: null })
  })

  retroChannel.on("idea_live_edit", editedIdea => {
    actions.updateIdea(editedIdea.id, editedIdea)
  })

  retroChannel.on("idea_edited", editedIdea => {
    const updatedIdea = { ...editedIdea, editing: false, liveEditText: null }
    actions.updateIdea(editedIdea.id, updatedIdea)
  })

  retroChannel.on("idea_deleted", deletedIdea => {
    actions.deleteIdea(deletedIdea.id)
  })

  retroChannel.on("vote_submitted", actions.addVote)

  retroChannel.on("idea_highlighted", highlightedIdea => {
    actions.updateIdea(highlightedIdea.id, { isHighlighted: !highlightedIdea.isHighlighted })
  })

  retroChannel.on("user_typing_idea", ({ userToken }) => {
    actions.updatePresence(userToken, { is_typing: true, last_typed: Date.now() })
    UserActivity.checkIfDoneTyping(store, userToken, () => {
      actions.updatePresence(userToken, { is_typing: false })
    })
  })

  retroChannel.on("user_typing_action_item", ({ userToken }) => {
    actions.updatePresence(userToken, { is_typing: true, last_typed: Date.now() })
    UserActivity.checkIfDoneTyping(store, userToken, () => {
      actions.updatePresence(userToken, { is_typing: false })
    })
  })

  return retroChannel
}

export default RetroChannel
