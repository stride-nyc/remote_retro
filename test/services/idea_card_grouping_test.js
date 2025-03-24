import deepFreeze from "deep-freeze"

import IdeaCardGrouping from "../../web/static/js/services/idea_card_grouping"

describe("IdeaCardGrouping", () => {
  describe("#findConnectedGroups", () => {
    describe("given an empty object", () => {
      it("returns an empty array", () => {
        expect(IdeaCardGrouping.findConnectedGroups({})).to.eql([])
      })
    })

    describe("given a single card", () => {
      it("returns an empty array (single cards don't form groups)", () => {
        const cardRefs = {
          1: {
            getBoundingClientRect: () => ({
              top: 0,
              left: 0,
              bottom: 100,
              right: 100,
            }),
          },
        }

        expect(IdeaCardGrouping.findConnectedGroups(cardRefs)).to.eql([])
      })
    })

    describe("given two non-overlapping cards", () => {
      it("returns an empty array", () => {
        const cardRefs = {
          1: {
            getBoundingClientRect: () => ({
              top: 0,
              left: 0,
              bottom: 100,
              right: 100,
            }),
          },
          2: {
            getBoundingClientRect: () => ({
              top: 200,
              left: 200,
              bottom: 300,
              right: 300,
            }),
          },
        }

        expect(IdeaCardGrouping.findConnectedGroups(cardRefs)).to.eql([])
      })
    })

    describe("given two overlapping cards", () => {
      it("returns a group containing both cards", () => {
        const cardRefs = {
          1: {
            getBoundingClientRect: () => ({
              top: 0,
              left: 0,
              bottom: 150,
              right: 150,
            }),
          },
          2: {
            getBoundingClientRect: () => ({
              top: 100,
              left: 100,
              bottom: 250,
              right: 250,
            }),
          },
        }

        const result = IdeaCardGrouping.findConnectedGroups(cardRefs)

        expect(result).to.have.length(1)
        expect(result[0].cardIds).to.have.members([1, 2])
        expect(result[0].groupId).to.be.oneOf([1, 2])
      })

      it("does not mutate the given data structure", () => {
        const cardRefs = deepFreeze({
          1: {
            getBoundingClientRect: () => ({
              top: 0,
              left: 0,
              bottom: 150,
              right: 150,
            }),
          },
          2: {
            getBoundingClientRect: () => ({
              top: 100,
              left: 100,
              bottom: 250,
              right: 250,
            }),
          },
        })

        expect(() => {
          IdeaCardGrouping.findConnectedGroups(cardRefs)
        }).to.not.throw()
      })
    })

    describe("given three cards in a chain (A overlaps B, B overlaps C, but A doesn't overlap C)", () => {
      it("returns a single group containing all three cards", () => {
        const cardRefs = {
          1: {
            getBoundingClientRect: () => ({
              top: 0,
              left: 0,
              bottom: 150,
              right: 150,
            }),
          },
          2: {
            getBoundingClientRect: () => ({
              top: 100,
              left: 100,
              bottom: 250,
              right: 250,
            }),
          },
          3: {
            getBoundingClientRect: () => ({
              top: 200,
              left: 200,
              bottom: 350,
              right: 350,
            }),
          },
        }

        const result = IdeaCardGrouping.findConnectedGroups(cardRefs)

        expect(result).to.have.length(1)
        expect(result[0].cardIds).to.have.members([1, 2, 3])
      })
    })

    describe("given two separate groups of overlapping cards", () => {
      it("returns two distinct groups", () => {
        const cardRefs = {
          // Group 1
          1: {
            getBoundingClientRect: () => ({
              top: 0,
              left: 0,
              bottom: 150,
              right: 150,
            }),
          },
          2: {
            getBoundingClientRect: () => ({
              top: 100,
              left: 100,
              bottom: 250,
              right: 250,
            }),
          },
          // Group 2
          3: {
            getBoundingClientRect: () => ({
              top: 400,
              left: 400,
              bottom: 550,
              right: 550,
            }),
          },
          4: {
            getBoundingClientRect: () => ({
              top: 500,
              left: 500,
              bottom: 650,
              right: 650,
            }),
          },
        }

        const result = IdeaCardGrouping.findConnectedGroups(cardRefs)

        expect(result).to.have.length(2)

        // Find the group containing cards 1 and 2
        const group1 = result.find(group => group.cardIds.includes(1) && group.cardIds.includes(2))

        // Find the group containing cards 3 and 4
        const group2 = result.find(group => group.cardIds.includes(3) && group.cardIds.includes(4))

        expect(group1).to.exist
        expect(group2).to.exist

        expect(group1.cardIds).to.have.members([1, 2])
        expect(group2.cardIds).to.have.members([3, 4])
      })
    })

    describe("when a card reference is null or undefined", () => {
      it("handles the case gracefully", () => {
        const cardRefs = {
          1: {
            getBoundingClientRect: () => ({
              top: 0,
              left: 0,
              bottom: 150,
              right: 150,
            }),
          },
          2: null,
          3: {
            getBoundingClientRect: () => ({
              top: 100,
              left: 100,
              bottom: 250,
              right: 250,
            }),
          },
        }

        const result = IdeaCardGrouping.findConnectedGroups(cardRefs)

        expect(result).to.have.length(1)
        expect(result[0].cardIds).to.have.members([1, 3])
      })
    })

    describe("edge cases for overlapping detection", () => {
      it("detects cards that touch at edges as overlapping", () => {
        const cardRefs = {
          1: {
            getBoundingClientRect: () => ({
              top: 0,
              left: 0,
              bottom: 100,
              right: 100,
            }),
          },
          2: {
            getBoundingClientRect: () => ({
              top: 0,
              left: 100, // Right edge of card 1 touches left edge of card 2
              bottom: 100,
              right: 200,
            }),
          },
        }

        const result = IdeaCardGrouping.findConnectedGroups(cardRefs)

        expect(result).to.have.length(1)
        expect(result[0].cardIds).to.have.members([1, 2])
      })

      it("detects cards that overlap by a small amount", () => {
        const cardRefs = {
          1: {
            getBoundingClientRect: () => ({
              top: 0,
              left: 0,
              bottom: 100,
              right: 101, // Overlaps by 1px
            }),
          },
          2: {
            getBoundingClientRect: () => ({
              top: 0,
              left: 100,
              bottom: 100,
              right: 200,
            }),
          },
        }

        const result = IdeaCardGrouping.findConnectedGroups(cardRefs)

        expect(result).to.have.length(1)
        expect(result[0].cardIds).to.have.members([1, 2])
      })
    })
  })
})
