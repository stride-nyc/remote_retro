import Collisions from "../../web/static/js/services/collisions"

describe("Collisions", () => {
  describe("identifyAllIdeaCollisionsSortedByIdAscending", () => {
    it("identifies no collisions in an empty list", () => {
      expect(Collisions.identifyAllIdeaCollisionsSortedByIdAscending([])).to.deep.equal(new Map())
    })

    describe("when two ideas' dimensions do not overlap", () => {
      const ideas = [{
        id: 1,
        x: 0,
        y: 0,
        height: 20,
        width: 20,
      }, {
        id: 2,
        x: 30,
        y: 30,
        height: 20,
        width: 20,
      }]

      it("does not identify any collisions", () => {
        const result = Collisions.identifyAllIdeaCollisionsSortedByIdAscending(ideas)
        expect(result).to.deep.equal(new Map([]))
      })
    })

    describe("when two ideas have dimensions that overlap", () => {
      const ideas = [{
        id: 1,
        x: 0,
        y: 0,
        height: 20,
        width: 20,
      }, {
        id: 2,
        x: 10,
        y: 10,
        height: 20,
        width: 20,
      }]

      it("identifies the collision between two ideas under a key of their lowest id", () => {
        const result = Collisions.identifyAllIdeaCollisionsSortedByIdAscending(ideas)
        expect(result.get(1)).to.deep.equal(new Set([1, 2]))
      })

      it("does not duplicate the collision under the higher id of the two ideas", () => {
        const result = Collisions.identifyAllIdeaCollisionsSortedByIdAscending(ideas)
        expect(result.get(2)).to.be.an("undefined")
      })

      describe("when the ideas are given in an order where larger ids precede smaller ones", () => {
        const ideas = [{
          id: 3,
          x: 0,
          y: 0,
          height: 20,
          width: 20,
        }, {
          id: 2,
          x: 10,
          y: 10,
          height: 20,
          width: 20,
        }]

        it("identifies the collision between two ideas under a key of their lowest id", () => {
          const result = Collisions.identifyAllIdeaCollisionsSortedByIdAscending(ideas)
          expect(result.get(2)).to.deep.equal(new Set([2, 3]))
        })
      })
    })

    describe("when two ideas are within 3 pixels of colliding on the y axis", () => {
      const ideas = [{
        id: 2,
        x: 20,
        y: 20,
        height: 20,
        width: 20,
      }, {
        id: 3,
        x: 20,
        y: 43,
        height: 20,
        width: 20,
      }]

      it("registers the collision due to their being within the 3px collision buffer", () => {
        const result = Collisions.identifyAllIdeaCollisionsSortedByIdAscending(ideas)
        expect(result.values()).to.include(new Set([2, 3]))
      })
    })

    describe("when two ideas are within 3 pixels of colliding on the x axis", () => {
      const ideas = [{
        id: 4,
        x: 20,
        y: 20,
        height: 20,
        width: 20,
      }, {
        id: 5,
        x: 43,
        y: 20,
        height: 20,
        width: 20,
      }]

      it("registers the collision due to their being within the 3px collision buffer", () => {
        const result = Collisions.identifyAllIdeaCollisionsSortedByIdAscending(ideas)
        expect(result.values()).to.include(new Set([4, 5]))
      })
    })

    describe("when two ideas' *corners* are within 3 pixels of colliding", () => {
      const ideas = [{
        id: 8,
        x: 20,
        y: 20,
        height: 20,
        width: 20,
      }, {
        id: 9,
        x: 43,
        y: 43,
        height: 20,
        width: 20,
      }]

      it("registers the collision due to their being within the 3px collision buffer", () => {
        const result = Collisions.identifyAllIdeaCollisionsSortedByIdAscending(ideas)
        expect(result.values()).to.include(new Set([8, 9]))
      })
    })

    describe("when one idea's dimensions overlap with multiple other ideas' dimensions", () => {
      const ideas = [{
        id: 1,
        x: 0,
        y: 0,
        height: 20,
        width: 20,
      }, {
        id: 2,
        x: 10,
        y: 10,
        height: 20,
        width: 20,
      }, {
        id: 3,
        x: 15,
        y: 15,
        height: 20,
        width: 20,
      }]

      it("consolidates *all* three under the highest id of the three ideas", () => {
        const result = Collisions.identifyAllIdeaCollisionsSortedByIdAscending(ideas)

        expect(result.get(1)).to.deep.equal(new Set([1, 2, 3]))
      })
    })
  })

  describe(".merge", () => {
    it("leaves single collisions untouched", () => {
      const collisionsMap = new Map([[348, new Set([348, 349])]])

      const result = Collisions.merge(collisionsMap)

      expect(result).to.deep.equal(collisionsMap)
    })

    it("merges collisions with a single degree of separation, housing them under the lowest id key", () => {
      const collisionsMap = new Map([
        [348, new Set([348, 349])],
        [349, new Set([349, 350])],
      ])

      const result = Collisions.merge(collisionsMap)

      expect(result).to.deep.equal(
        new Map([[348, new Set([348, 349, 350])]])
      )
    })

    it("merges collisions with 2+ degrees of separation, housing them under lowest id key", () => {
      const collisionsMap = new Map([
        [348, new Set([348, 349])],
        [349, new Set([349, 350])],
        [350, new Set([350, 351])],
      ])

      const result = Collisions.merge(collisionsMap)

      expect(result).to.deep.equal(
        new Map([[348, new Set([348, 349, 350, 351])]])
      )
    })

    it("connects the keys-value pairs via intersection of their value sets ", () => {
      const collisionsMap = new Map([
        [1, new Set([1, 4])],
        [3, new Set([3, 4])],
      ])

      const result = Collisions.merge(collisionsMap)

      expect(result).to.deep.equal(
        new Map([[1, new Set([1, 4, 3])]])
      )
    })

    it("consolidates *multiple* collision clusters, ", () => {
      const collisionsMap = new Map([
        [1, new Set([1, 4, 7])],
        [2, new Set([2, 4])],
        [5, new Set([5, 9, 11])],
        [9, new Set([9, 13])],
      ])

      const result = Collisions.merge(collisionsMap)

      expect(result).to.deep.equal(new Map([
        [1, new Set([1, 4, 2, 7])],
        [5, new Set([5, 9, 11, 13])],
      ]))
    })

    describe("when a non-first, non-last key is only connected to a collision by shared values", () => {
      it("includes that key in the consolidated grouping", () => {
        const collisionsMap = new Map([
          [376, new Set([376, 387])],
          [380, new Set([380, 390])],
          [387, new Set([387, 390])],
        ])

        const result = Collisions.merge(collisionsMap)

        expect(result.get(376)).to.include(380)
      })
    })
  })
})
