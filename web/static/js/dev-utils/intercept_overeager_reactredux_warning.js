export default () => {
  /*
    react-redux logs a warning when the Provider receives a store prop that doesn't match
    the original store. Because JavaScript lacks a native means for checking identity-equality,
    it sees that the attributes are different once we've replaced the reducer on hot module updates,
    and assumes we're passing an entirely separate store object, which we are not.
  */
  const oldError = console.error

  console.error = (...args) => {
    if (/<Provider> does not support/.test(args[0])) { return }
    oldError(...args)
  }
}
