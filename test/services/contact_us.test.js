import ContactUs from "../../web/static/js/services/contact_us"

describe("ContactUs", () => {
  describe("buildPrepulatedFormForUser", () => {
    const stubUser = {
      email: "jb.vanderhoop@stridenyc.com",
      family_name: "Vander Hoop",
      given_name: "Joe Bob",
    }

    test("builds out a query-paramed link to stride's contact us page", () => {
      const result = ContactUs.buildPrepulatedFormForUser(stubUser)
      expect(result.startsWith("https://www.stridenyc.com/contact?")).toBe(true)
    })

    test("identifes the referrer as RemoteRetro", () => {
      const result = ContactUs.buildPrepulatedFormForUser(stubUser)
      expect(result).toContain("referrer=RemoteRetro")
    })

    test("encodes the user's first name as a query parameter", () => {
      const result = ContactUs.buildPrepulatedFormForUser(stubUser)
      expect(result).toContain("firstname=Joe%20Bob")
    })

    test("encodes the user's last name as a query parameter", () => {
      const result = ContactUs.buildPrepulatedFormForUser(stubUser)
      expect(result).toContain("lastname=Vander%20Hoop")
    })

    test("encodes the user's email as a query parameter", () => {
      const result = ContactUs.buildPrepulatedFormForUser(stubUser)
      expect(result).toContain("email=jb.vanderhoop%40stridenyc.com")
    })

    describe("when the user lacks a last name", () => {
      const user = {
        email: "madonna@prince.com",
        given_name: "Madonna",
        family_name: undefined,
      }

      test("does not include a lastname query param", () => {
        const result = ContactUs.buildPrepulatedFormForUser(user)
        expect(result).not.toContain("lastname")
      })
    })
  })
})
