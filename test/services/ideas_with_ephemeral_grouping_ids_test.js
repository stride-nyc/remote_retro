import deepFreeze from "deep-freeze"
import uniqBy from "lodash/uniqBy"

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
          id: 5,
          x: 0,
          y: 0,
          height: 10,
          width: 10,
        }, {
          id: 9,
          x: 1,
          y: 1,
          height: 10,
          width: 10,
        }]
      })

      it("assigns a 1-indexed grouping id to the two ideas", () => {
        const result = IdeasWithEphemeralGroupingIds.buildFrom(ideas)

        expect(result).to.eql([{
          id: 5,
          x: 0,
          y: 0,
          height: 10,
          width: 10,
          ephemeralGroupingId: 1,
        }, {
          id: 9,
          x: 1,
          y: 1,
          height: 10,
          width: 10,
          ephemeralGroupingId: 1,
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
        id: 5,
        x: 200,
        y: 200,
        height: 200,
        width: 200,
      }, {
        id: 9,
        x: 250,
        y: 250,
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
          ephemeralGroupingId: 1,
        }, {
          id: 9,
          x: 250,
          y: 250,
          height: 200,
          width: 200,
          ephemeralGroupingId: 1,
        }, {
          id: 14,
          x: 400,
          y: 400,
          height: 200,
          width: 200,
          ephemeralGroupingId: 1,
        }])
      })
    })

    describe("given a list containing two distinct clusters in different areas of the grid", () => {
      const ideas = [{
        id: 2,
        x: 0,
        y: 0,
        height: 200,
        width: 200,
      }, {
        id: 7,
        x: 50,
        y: 50,
        height: 200,
        width: 200,
      }, {
        id: 11,
        x: 600,
        y: 600,
        height: 200,
        width: 200,
      }, {
        id: 13,
        x: 650,
        y: 650,
        height: 200,
        width: 200,
      }]

      it("identifies two distinct groupings", () => {
        const result = IdeasWithEphemeralGroupingIds.buildFrom(ideas)

        expect(uniqBy(result, "ephemeralGroupingId")).to.have.length(2)
      })

      describe("ephemeral grouping id", () => {
        it("is derived by taking the lowest idea id in each group, and using that idea id's sort ranking", () => {
          const result = IdeasWithEphemeralGroupingIds.buildFrom(ideas)
          const ideaIdsWithGroupingIdsOnly = result.map(({ id, ephemeralGroupingId }) => ({
            id,
            ephemeralGroupingId,
          }))

          expect(ideaIdsWithGroupingIdsOnly).to.eql([{
            id: 2,
            ephemeralGroupingId: 1,
          }, {
            id: 7,
            ephemeralGroupingId: 1,
          }, {
            id: 11,
            ephemeralGroupingId: 3,
          }, {
            id: 13,
            ephemeralGroupingId: 3,
          }])
        })
      })
    })
  })
})
