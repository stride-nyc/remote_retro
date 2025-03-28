import deepFreeze from "deep-freeze"
import uniqBy from "lodash/uniqBy"

import IdeasWithEphemeralGroupingIds from "../../web/static/js/services/ideas_with_ephemeral_grouping_ids"

describe("IdeasWithEphemeralGroupingIds", () => {
  describe("#buildFrom", () => {
    describe("given an empty list", () => {
      test("leaves the list unchanged", () => {
        expect(IdeasWithEphemeralGroupingIds.buildFrom([])).toEqual([])
      })
    })

    describe("given a list with 1 idea", () => {
      test("assigns no grouping id to the idea", () => {
        const ideas = [{
          id: 11,
          x: 200,
          y: 300,
          height: 200,
          width: 300,
        }]

        expect(IdeasWithEphemeralGroupingIds.buildFrom(ideas)).toEqual(ideas)
      })
    })

    describe("when the list contains multiple items", () => {
      let ideas

      test("sorts them by id", () => {
        ideas = [{ id: 14 }, { id: 8 }]

        const resultingIds = IdeasWithEphemeralGroupingIds.buildFrom(ideas).map(idea => idea.id)

        expect(resultingIds).toEqual([8, 14])
      })

      describe("when the ideas' physical dimensions do not overlap", () => {
        test("assigns no grouping ids to the ideas", () => {
          ideas = [{
            id: 14, x: 0, y: 0, height: 10, width: 10,
          }, {
            id: 8, x: 500, y: 500, height: 10, width: 10,
          }]

          const results = IdeasWithEphemeralGroupingIds.buildFrom(ideas)

          results.forEach(idea => {
            expect(idea.ephemeralGroupingId).toBeUndefined()
          })
        })
      })
    })

    describe("when ideas' physical dimensions *do* overlap", () => {
      let ideas

      beforeEach(() => {
        ideas = [{
          id: 5, x: 0, y: 0, height: 10, width: 10,
        }, {
          id: 9, x: 1, y: 1, height: 10, width: 10,
        }]
      })

      test("assigns a 1-indexed grouping id to the two ideas", () => {
        const result = IdeasWithEphemeralGroupingIds.buildFrom(ideas)

        expect(result).toEqual([
          { id: 5, x: 0, y: 0, height: 10, width: 10, ephemeralGroupingId: 1 },
          { id: 9, x: 1, y: 1, height: 10, width: 10, ephemeralGroupingId: 1 },
        ])
      })

      test("does not mutate the given datastructure", () => {
        const frozenIdeas = deepFreeze(ideas)

        expect(() => {
          IdeasWithEphemeralGroupingIds.buildFrom(frozenIdeas)
        }).not.toThrow()
      })
    })

    describe("when ideas' physical placements create a chain within the grid", () => {
      const ideas = [{ id: 5, x: 200, y: 200, height: 200, width: 200 },
        { id: 9, x: 250, y: 250, height: 200, width: 200 },
        { id: 14, x: 400, y: 400, height: 200, width: 200 }]

      test("creates a grouping for *all* items in the chain", () => {
        const result = IdeasWithEphemeralGroupingIds.buildFrom(ideas)

        expect(result).toEqual([
          { id: 5, x: 200, y: 200, height: 200, width: 200, ephemeralGroupingId: 1 },
          { id: 9, x: 250, y: 250, height: 200, width: 200, ephemeralGroupingId: 1 },
          { id: 14, x: 400, y: 400, height: 200, width: 200, ephemeralGroupingId: 1 },
        ])
      })
    })

    describe("given a list containing two distinct clusters in different areas of the grid", () => {
      const ideas = [
        { id: 2, x: 0, y: 0, height: 200, width: 200 },
        { id: 7, x: 50, y: 50, height: 200, width: 200 },
        { id: 11, x: 600, y: 600, height: 200, width: 200 },
        { id: 13, x: 650, y: 650, height: 200, width: 200 },
      ]

      test("identifies two distinct groupings", () => {
        const result = IdeasWithEphemeralGroupingIds.buildFrom(ideas)

        expect(uniqBy(result, "ephemeralGroupingId")).toHaveLength(2)
      })

      test("ephemeral grouping id is derived by taking the lowest idea id in each group's sort ranking", () => {
        const result = IdeasWithEphemeralGroupingIds.buildFrom(ideas)
        const ideaIdsWithGroupingIdsOnly = result.map(({ id, ephemeralGroupingId }) => ({
          id, ephemeralGroupingId,
        }))

        expect(ideaIdsWithGroupingIdsOnly).toEqual([
          { id: 2, ephemeralGroupingId: 1 },
          { id: 7, ephemeralGroupingId: 1 },
          { id: 11, ephemeralGroupingId: 3 },
          { id: 13, ephemeralGroupingId: 3 },
        ])
      })
    })
  })
})
