import deepFreeze from "deep-freeze"

import IdeasWithEphemeralGroupingIds from "../../web/static/js/services/ideas_with_ephemeral_grouping_ids"

describe("IdeasWithEphemeralGroupingIds", () => {
  describe("#buildFrom", () => {
    describe("given an empty list", () => {
      it("leaves the list unchanged", () => {
        expect(IdeasWithEphemeralGroupingIds.buildFrom([])).to.eql([])
      })
    })

    describe("given a list with 1 idea", () => {
      it("assigns no grouping id to the idea", () => {
        const ideas = [{
          id: 11,
          x: 200,
          y: 300,
          height: 200,
          width: 300,
        }]

        expect(IdeasWithEphemeralGroupingIds.buildFrom(ideas)).to.eql(ideas)
      })
    })

    describe("when the list contains multiple items", () => {
      let ideas

      it("sorts them by id", () => {
        ideas = [{
          id: 14,
        }, {
          id: 8,
        }]

        const resultingIds = IdeasWithEphemeralGroupingIds.buildFrom(ideas).map(idea => idea.id)

        expect(resultingIds).to.eql([8, 14])
      })

      describe("when the ideas' physical dimensions do not overlap", () => {
        it("assigns no grouping ids to the ideas", () => {
          ideas = [{
            id: 14,
            x: 0,
            y: 0,
            height: 10,
            width: 10,
          }, {
            id: 8,
            x: 500,
            y: 500,
            height: 10,
            width: 10,
          }]

          const results = IdeasWithEphemeralGroupingIds.buildFrom(ideas)

          results.forEach(idea => {
            expect(idea.ephemeralGroupingId).to.be.an("undefined")
          })
        })
      })
    })

    describe("when ideas' physical dimensions *do* overlap", () => {
      let ideas

      beforeEach(() => {
        ideas = [{
          id: 9,
          x: 1,
          y: 1,
          height: 10,
          width: 10,
        }, {
          id: 5,
          x: 0,
          y: 0,
          height: 10,
          width: 10,
        }]
      })

      it("assigns a grouping id of the lowest existing id between the two ideas", () => {
        const result = IdeasWithEphemeralGroupingIds.buildFrom(ideas)

        expect(result).to.eql([{
          id: 5,
          x: 0,
          y: 0,
          height: 10,
          width: 10,
          ephemeralGroupingId: 5,
        }, {
          id: 9,
          x: 1,
          y: 1,
          height: 10,
          width: 10,
          ephemeralGroupingId: 5,
        }])
      })

      it("does not mutate the given datastructure", () => {
        const frozenIdeas = deepFreeze(ideas)

        expect(() => {
          IdeasWithEphemeralGroupingIds.buildFrom(frozenIdeas)
        }).to.not.throw()
      })
    })

    describe("when ideas' physical placements create a chain within the grid", () => {
      const ideas = [{
        id: 9,
        x: 250,
        y: 250,
        height: 200,
        width: 200,
      }, {
        id: 5,
        x: 200,
        y: 200,
        height: 200,
        width: 200,
      }, {
        id: 14,
        x: 400,
        y: 400,
        height: 200,
        width: 200,
      }]

      it("creates a grouping for *all* items in the chain", () => {
        const result = IdeasWithEphemeralGroupingIds.buildFrom(ideas)

        expect(result).to.eql([{
          id: 5,
          x: 200,
          y: 200,
          height: 200,
          width: 200,
          ephemeralGroupingId: 5,
        }, {
          id: 9,
          x: 250,
          y: 250,
          height: 200,
          width: 200,
          ephemeralGroupingId: 5,
        }, {
          id: 14,
          x: 400,
          y: 400,
          height: 200,
          width: 200,
          ephemeralGroupingId: 5,
        }])
      })
    })

    describe("given a list containing two distinct clusters in different areas of the grid", () => {
      it("assigns separate grouping ids to the different groups, using the lowest id that appears in each group", () => {
        const ideas = [{
          id: 11,
          x: 0,
          y: 0,
          height: 200,
          width: 200,
        }, {
          id: 7,
          x: 100,
          y: 100,
          height: 200,
          width: 200,
        }, {
          id: 13,
          x: 600,
          y: 600,
          height: 200,
          width: 200,
        }, {
          id: 2,
          x: 700,
          y: 700,
          height: 200,
          width: 200,
        }]

        const result = IdeasWithEphemeralGroupingIds.buildFrom(ideas)

        expect(result).to.eql([{
          id: 2,
          ephemeralGroupingId: 2,
          x: 700,
          y: 700,
          height: 200,
          width: 200,
        }, {
          id: 7,
          ephemeralGroupingId: 7,
          x: 100,
          y: 100,
          height: 200,
          width: 200,
        }, {
          id: 11,
          ephemeralGroupingId: 7,
          x: 0,
          y: 0,
          height: 200,
          width: 200,
        }, {
          id: 13,
          ephemeralGroupingId: 2,
          x: 600,
          y: 600,
          height: 200,
          width: 200,
        }])
      })
    })
  })
})
