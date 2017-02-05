class UrlHelpers {
  static parseRetroUUID(pathname) {
    return pathname.split("/retros/")[1]
  }
}

export default UrlHelpers
