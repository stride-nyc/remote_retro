class UserActivity {
  static checkIfDoneTyping(store, userToken, done) {
    const interval = setInterval(() => {
      const users = store.getState().user
      const user = users.find(user => user.token === userToken)
      const noNewTypingEventsReceived = (Date.now() - user.last_typed) > 650
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
