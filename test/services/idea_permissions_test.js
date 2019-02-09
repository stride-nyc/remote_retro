import IdeaPermissions from "../../web/static/js/services/idea_permissions"

describe("IdeaPermissions", () => {
  describe(".canUserEditContents", () => {
    context("when the user authored the idea", () => {
      context("and is not the facilitator", () => {
        const user = {
          id: 56,
          is_facilitator: false,
        }

        const idea = {
          user_id: 56,
        }

        it("returns true", () => {
          expect(
            IdeaPermissions.canUserEditContents(idea, user)
          ).to.be.true
        })
      })
    })

    context("when the user didn't author the idea", () => {
      context("and isn't the facilitator", () => {
        const user = {
          id: 56,
          is_facilitator: false,
        }

        const idea = {
          user_id: 61,
        }

        it("returns false", () => {
          expect(
            IdeaPermissions.canUserEditContents(idea, user)
          ).to.be.false
        })
      })

      context("but is the facilitator", () => {
        const user = {
          id: 56,
          is_facilitator: true,
        }

        const idea = {
          user_id: 61,
        }

        it("returns true", () => {
          expect(
            IdeaPermissions.canUserEditContents(idea, user)
          ).to.be.true
        })
      })
    })
  })
})

