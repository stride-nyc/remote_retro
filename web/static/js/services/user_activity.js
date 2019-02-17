export const USER_TYPING_ANIMATION_DURATION = 650

class UserActivity {
  static checkIfDoneTyping(store, userToken, done) {
    const interval = setInterval(() => {
      const { presences } = store.getState()
      const presence = presences.find(presence => presence.token === userToken)

      /* account for cases where user departs within desired animation duration */
      if (!presence) { return }

      const timeElapsedSinceLastTyped = (Date.now() - presence.last_typed)
      const noNewTypingEventsReceived = timeElapsedSinceLastTyped > USER_TYPING_ANIMATION_DURATION

      if (noNewTypingEventsReceived) {
        clearInterval(interval)
        if (typeof done === "function") {
          done()
        }
      }
    }, 10)
  }
}

export default UserActivity
