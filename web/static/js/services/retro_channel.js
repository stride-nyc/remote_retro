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
  const { addIdea,
    updateRetroSync,
    setPresences,
    updateIdea,
    deleteIdea,
    addVote,
    updatePresence,
    retractVote } = actions

  const presence = new Presence(retroChannel)

  presence.onSync(() => {
    const users = presence.list((_token, presence) => (presence.user))
    setPresences(users)
  })

  retroChannel.on("idea_committed", addIdea)

  retroChannel.on("retro_edited", updateRetroSync)

  retroChannel.on("idea_edit_state_enabled", ({ id }) => {
    updateIdea(id, { inEditState: true, isLocalEdit: false })
  })

  retroChannel.on("idea_edit_state_disabled", disabledIdea => {
    updateIdea(disabledIdea.id, { inEditState: false, liveEditText: null })
  })

  retroChannel.on("idea_live_edit", editedIdea => {
    updateIdea(editedIdea.id, editedIdea)
  })

  retroChannel.on("idea_edited", editedIdea => {
    const updatedIdea = {
      ...editedIdea,
      inEditState: false,
      editSubmitted: false,
      liveEditText: null,
    }

    updateIdea(editedIdea.id, updatedIdea)
  })

  retroChannel.on("idea_deleted", deletedIdea => {
    deleteIdea(deletedIdea.id)
  })

  retroChannel.on("vote_submitted", addVote)
  retroChannel.on("vote_retracted", retractVote)

  retroChannel.on("idea_typing_event", ({ userToken }) => {
    updatePresence(userToken, { is_typing: true, last_typed: Date.now() })
    UserActivity.checkIfDoneTyping(store, userToken, () => {
      updatePresence(userToken, { is_typing: false })
    })
  })

  return retroChannel
}

export default RetroChannel
