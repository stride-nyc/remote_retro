class UserActivity {
  static checkIfDoneTyping(user, done) {
    const interval = setInterval(() => {
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
