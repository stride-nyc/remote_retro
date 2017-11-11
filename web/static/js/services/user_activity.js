export const USER_TYPING_ANIMATION_DURATION = 650

class UserActivity {
  static checkIfDoneTyping(store, userToken, done) {
    const interval = setInterval(() => {
      const users = store.getState().users
      const user = users.find(user => user.token === userToken)
      const noNewTypingEventsReceived =
        (Date.now() - user.last_typed) > USER_TYPING_ANIMATION_DURATION
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
