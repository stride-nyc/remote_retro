import ContactUs from "../../web/static/js/services/contact_us"

describe("ContactUs", () => {
  describe("buildPrepulatedFormForUser", () => {
    const stubUser = {
      email: "jb.vanderhoop@stridenyc.com",
      family_name: "Vander Hoop",
      given_name: "Joe Bob",
    }

    it("builds out a query-paramed link to stride's contact us page", () => {
      const result = ContactUs.buildPrepulatedFormForUser(stubUser)
      expect(result.startsWith("https://stridenyc.com/contact?")).to.eql(true)
    })

    it("identifes the referrer as RemoteRetro", () => {
      const result = ContactUs.buildPrepulatedFormForUser(stubUser)
      expect(result).to.contain("referrer=RemoteRetro")
    })

    it("encodes the user's first name as a query parameter", () => {
      const result = ContactUs.buildPrepulatedFormForUser(stubUser)
      expect(result).to.contain("firstname=Joe%20Bob")
    })

    it("encodes the user's last name as a query parameter", () => {
      const result = ContactUs.buildPrepulatedFormForUser(stubUser)
      expect(result).to.contain("lastname=Vander%20Hoop")
    })

    it("encodes the user's email as a query parameter", () => {
      const result = ContactUs.buildPrepulatedFormForUser(stubUser)
      expect(result).to.contain("email=jb.vanderhoop%40stridenyc.com")
    })

    describe("when the user lacks a last name", () => {
      const user = {
        email: "madonna@prince.com",
        given_name: "Madonna",
        family_name: undefined,
      }

      it("does not include a lastname query param", () => {
        const result = ContactUs.buildPrepulatedFormForUser(user)
        expect(result).to.not.contain("lastname")
      })
    })
  })
})
