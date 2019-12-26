import { Socket, Presence } from "phoenix"

import UserActivity from "./user_activity"

import { comprehensiveIdeaEditStateNullifications } from "../redux/ideas"

class RetroChannel {
  constructor({ userToken, retroUUID }) {
    const socket = new Socket("/socket", { params: { userToken } })
    socket.connect()

    this.client = socket.channel(`retro:${retroUUID}`)
  }

  applyListenersWithDispatch(store, actions) {
    const {
      addIdea,
      retroUpdateCommitted,
      setPresences,
      updateIdea,
      deleteIdea,
      voteSubmission,
      updatePresence,
      voteRetraction,
    } = actions

    const { client } = this

    const presence = new Presence(client)

    presence.onSync(() => {
      const users = presence.list((_token, presence) => (presence.user))
      setPresences(users)
    })

    client.on("idea_committed", addIdea)

    client.on("retro_edited", retroUpdateCommitted)

    client.on("idea_edit_state_enabled", ({ id }) => {
      updateIdea(id, { inEditState: true, isLocalEdit: false })
    })

    client.on("idea_edit_state_disabled", disabledIdea => {
      updateIdea(disabledIdea.id, { inEditState: false, liveEditText: null })
    })

    client.on("idea_live_edit", editedIdea => {
      updateIdea(editedIdea.id, editedIdea)
    })

    client.on("idea_dragged_in_grouping_stage", ({ id, x, y }) => {
      updateIdea(id, { x, y, inEditState: true })
    })

    client.on("idea_edited", editedIdea => {
      const updatedIdea = {
        ...editedIdea,
        ...comprehensiveIdeaEditStateNullifications,
      }

      updateIdea(editedIdea.id, updatedIdea)
    })

    client.on("idea_deleted", deletedIdea => {
      deleteIdea(deletedIdea.id)
    })

    client.on("vote_submitted", voteSubmission)
    client.on("vote_retracted", voteRetraction)

    client.on("idea_typing_event", ({ userToken }) => {
      updatePresence(userToken, { is_typing: true, last_typed: Date.now() })
      UserActivity.checkIfDoneTyping(store, userToken, () => {
        updatePresence(userToken, { is_typing: false })
      })
    })
  }

  join() {
    return this.client.join()
  }

  push(...args) {
    return this.client.push(...args)
  }

  pushWithRetries(message, payload, callbacks) {
    const push = this.push(message, payload)

    push.receive("ok", callbacks.onOk)

    const retryTimeouts = [750, 1500, 3000]

    push.receive("error", error => {
      if (retryTimeouts.length) {
        const retryTimeout = retryTimeouts.shift()
        const retry = push.send.bind(push)
        setTimeout(retry, retryTimeout)
      } else {
        callbacks.onErr(error)
      }
    })
  }
}

export default RetroChannel
