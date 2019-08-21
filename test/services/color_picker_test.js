import ColorPicker from "../../web/static/js/services/color_picker"

describe("ColorPicker ", () => {
  describe(".fromSeed ", () => {
    describe("given a numeric seed value", () => {
      it("returns a hex color code", () => {
        const result = ColorPicker.fromSeed(8001)

        expect(result).to.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      })

      it("returns the same color given the same seed", () => {
        const firstReturnVal = ColorPicker.fromSeed(1001)
        const secondReturnVal = ColorPicker.fromSeed(1001)

        expect(firstReturnVal).to.eql(secondReturnVal)
      })

      it("returns different values given different seeds", () => {
        const firstReturnVal = ColorPicker.fromSeed(1003)
        const secondReturnVal = ColorPicker.fromSeed(1004)

        expect(firstReturnVal).to.not.eql(secondReturnVal)
      })

      describe("when the seed value is 0", () => {
        it("throws an error", () => {
          expect(() => {
            ColorPicker.fromSeed(0)
          }).to.throw()
        })
      })

      describe("when the seed value is less than zero", () => {
        it("throws an error", () => {
          expect(() => {
            ColorPicker.fromSeed(-1)
          }).to.throw()
        })
      })

      describe("when given a list of colors", () => {
        describe("and the seed number is equal to the length of the color list", () => {
          it("return the color at the tail of the list", () => {
            const inputColorList = ["color-1", "color-2"]
            const result = ColorPicker.fromSeed(2, inputColorList)

            expect(result).to.eql("color-2")
          })
        })

        describe("and the seed number is one larger than the length of the color list", () => {
          it("return the color at the head of the list", () => {
            const inputColorList = ["color-1", "color-2", "color-3"]
            const result = ColorPicker.fromSeed(4, inputColorList)

            expect(result).to.eql("color-1")
          })
        })
      })
    })
  })
})
