import Collisions from "../../web/static/js/services/collisions"

describe("Collisions", () => {
  describe(".merge", () => {
    it("leaves single collisions untouched", () => {
      const collisionsMap = new Map([[348, new Set([349])]])

      const result = Collisions.merge(collisionsMap)

      expect(result).to.deep.equal(collisionsMap)
    })

    it("merges collisions with a single degree of separation, housing them under the lowest id key", () => {
      const collisionsMap = new Map([
        [348, new Set([349])],
        [349, new Set([350])],
      ])

      const result = Collisions.merge(collisionsMap)

      expect(result).to.deep.equal(
        new Map([[348, new Set([349, 350])]])
      )
    })

    it("merges collisions with 2+ degrees of separation, housing them under lowest id key", () => {
      const collisionsMap = new Map([
        [348, new Set([349])],
        [349, new Set([350])],
        [350, new Set([351])],
      ])

      const result = Collisions.merge(collisionsMap)

      expect(result).to.deep.equal(
        new Map([[348, new Set([349, 350, 351])]])
      )
    })

    it("connects the keys-value pairs via intersection of their value sets ", () => {
      const collisionsMap = new Map([
        [1, new Set([4])],
        [3, new Set([4])],
      ])

      const result = Collisions.merge(collisionsMap)

      expect(result).to.deep.equal(
        new Map([[1, new Set([4, 3])]])
      )
    })

    it("consolidates *multiple* collision clusters, ", () => {
      const collisionsMap = new Map([
        [1, new Set([4, 7])],
        [2, new Set([4])],
        [5, new Set([9, 11])],
        [9, new Set([13])],
      ])

      const result = Collisions.merge(collisionsMap)

      expect(result).to.deep.equal(new Map([
        [1, new Set([4, 2, 7])],
        [5, new Set([9, 11, 13])],
      ]))
    })

    // `Map` keys maintain their insertion order
    describe("when a non-first, non-last key is only connected to a collision by shared values", () => {
      it("includes that key in the consolidated grouping", () => {
        const collisionsMap = new Map([
          [376, new Set([387])],
          [380, new Set([390])],
          [387, new Set([390])],
        ])

        const result = Collisions.merge(collisionsMap)

        expect(result.get(376)).to.include(380)
      })
    })
  })
})
