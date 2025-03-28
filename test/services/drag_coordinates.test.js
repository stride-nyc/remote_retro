import DragCoordinates from "../../web/static/js/services/drag_coordinates"

describe("DragCoordinates", () => {
  describe("reconcileMobileZoomOffsets", () => {
    describe("when there is no pageXOffset or pageYOffset", () => {
      test("returns the getSourceClientOffset of the given drag monitor", () => {
        const mockDragMonitor = {
          getSourceClientOffset: () => ({ x: 519, y: 1112 }),
        }

        const result = DragCoordinates.reconcileMobileZoomOffsets(mockDragMonitor)

        expect(result).toEqual({ x: 519, y: 1112 })
      })
    })

    describe("when the pageXOffset is above zero due to a mobile 'pinch' zoom", () => {
      beforeAll(() => {
        global.pageXOffset = 43
      })

      afterAll(() => {
        global.pageXOffset = 0
      })

      test("adds the x offset to the x value provided by the drag monitor", () => {
        const mockDragMonitor = {
          getSourceClientOffset: () => ({ x: 6, y: 0 }),
        }

        const result = DragCoordinates.reconcileMobileZoomOffsets(mockDragMonitor)

        expect(result.x).toBe(49)
      })
    })

    describe("when the pageYOffset is above zero due to a mobile 'pinch' zoom", () => {
      beforeAll(() => {
        global.pageYOffset = 63
      })

      afterAll(() => {
        global.pageYOffset = 0
      })

      test("adds the y offset to the y value provided by the drag monitor", () => {
        const mockDragMonitor = {
          getSourceClientOffset: () => ({ x: 0, y: 2 }),
        }

        const result = DragCoordinates.reconcileMobileZoomOffsets(mockDragMonitor)

        expect(result.y).toBe(65)
      })
    })
  })
})
