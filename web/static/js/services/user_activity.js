class UserActivity {
  static checkIfDoneTyping(channel, userToken, done) {
    const interval = setInterval(() => {
      const { users } = channel.props
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
