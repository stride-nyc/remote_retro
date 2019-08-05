import DragCoordinates from "../../web/static/js/services/drag_coordinates"

describe("DragCoordinates", () => {
  describe("reconcileMobileZoomOffsets", () => {
    describe("when there is no pageXOffset or pageYOffset", () => {
      it("returns the getSourceClientOffset of the given drag monitor", () => {
        const mockDragMonitor = {
          getSourceClientOffset: () => ({ x: 519, y: 1112 }),
        }

        const result = DragCoordinates.reconcileMobileZoomOffsets(mockDragMonitor)

        expect(result).to.deep.equal({ x: 519, y: 1112 })
      })
    })

    describe("when the pageXOffset is above zero due to a mobile 'pinch' zoom", () => {
      before(() => {
        global.pageXOffset = 43
      })

      after(() => {
        global.pageXOffset = 0
      })

      it("adds the x offset to the x value provided by the drag monitor", () => {
        const mockDragMonitor = {
          getSourceClientOffset: () => ({ x: 6, y: 0 }),
        }

        const result = DragCoordinates.reconcileMobileZoomOffsets(mockDragMonitor)

        expect(result.x).to.equal(49)
      })
    })

    describe("when the pageYOffset is above zero due to a mobile 'pinch' zoom", () => {
      before(() => {
        global.pageYOffset = 63
      })

      after(() => {
        global.pageYOffset = 0
      })

      it("adds the y offset to the y value provided by the drag monitor", () => {
        const mockDragMonitor = {
          getSourceClientOffset: () => ({ x: 0, y: 2 }),
        }

        const result = DragCoordinates.reconcileMobileZoomOffsets(mockDragMonitor)

        expect(result.y).to.equal(65)
      })
    })
  })
})
