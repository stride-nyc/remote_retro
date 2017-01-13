export default class PresenceUtils {
  static usersSortedByArrivalAsc(presences) {
    let users = Object.keys(presences)

    return users.sort((usernameA, usernameB) => {
      const userAMetadata = presences[usernameA].user
      const userBMetadata = presences[usernameB].user
      return userAMetadata.online_at < userBMetadata.online_at ? -1 : 1
    })
  }
}
