import { expect } from "chai"
import UrlHelpers from "../../web/static/js/services/url_helpers"

describe("UrlHelpers", () => {
  describe("parseRetroUUID", () => {
    it("returns the last url segment in the given path", () => {
      const result = UrlHelpers.parseRetroUUID("/retros/38347348-83abkd0-3838m")
      expect(result).to.equal("38347348-83abkd0-3838m")
    })
  })
})
