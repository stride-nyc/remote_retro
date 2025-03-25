import IdeaPermissions from "../../web/static/js/services/idea_permissions"

describe("IdeaPermissions", () => {
  describe(".canUserEditContents", () => {
    describe("when the user authored the idea", () => {
      describe("and is not the facilitator", () => {
        const user = {
          id: 56,
          is_facilitator: false,
        }

        const idea = {
          user_id: 56,
        }

        test("returns true", () => {
          expect(IdeaPermissions.canUserEditContents(idea, user)).toBe(true)
        })
      })
    })

    describe("when the user didn't author the idea", () => {
      describe("and isn't the facilitator", () => {
        const user = {
          id: 56,
          is_facilitator: false,
        }

        const idea = {
          user_id: 61,
        }

        test("returns false", () => {
          expect(IdeaPermissions.canUserEditContents(idea, user)).toBe(false)
        })
      })

      describe("but is the facilitator", () => {
        const user = {
          id: 56,
          is_facilitator: true,
        }

        const idea = {
          user_id: 61,
        }

        test("returns true", () => {
          expect(IdeaPermissions.canUserEditContents(idea, user)).toBe(true)
        })
      })
    })
  })
})
