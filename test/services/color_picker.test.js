import ColorPicker from "../../web/static/js/services/color_picker"

describe("ColorPicker ", () => {
  describe(".fromSeed ", () => {
    describe("given a numeric seed value", () => {
      test("returns a hex color code", () => {
        const result = ColorPicker.fromSeed(8001)

        expect(result).toMatch(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      })

      test("returns the same color given the same seed", () => {
        const firstReturnVal = ColorPicker.fromSeed(1001)
        const secondReturnVal = ColorPicker.fromSeed(1001)

        expect(firstReturnVal).toEqual(secondReturnVal)
      })

      test("returns different values given different seeds", () => {
        const firstReturnVal = ColorPicker.fromSeed(1003)
        const secondReturnVal = ColorPicker.fromSeed(1004)

        expect(firstReturnVal).not.toEqual(secondReturnVal)
      })

      describe("when the seed value is 0", () => {
        test("throws an error", () => {
          expect(() => {
            ColorPicker.fromSeed(0)
          }).toThrow()
        })
      })

      describe("when the seed value is less than zero", () => {
        test("throws an error", () => {
          expect(() => {
            ColorPicker.fromSeed(-1)
          }).toThrow()
        })
      })

      describe("when given a list of colors", () => {
        describe("and the seed number is equal to the length of the color list", () => {
          test("return the color at the tail of the list", () => {
            const inputColorList = ["color-1", "color-2"]
            const result = ColorPicker.fromSeed(2, inputColorList)

            expect(result).toEqual("color-2")
          })
        })

        describe("and the seed number is one larger than the length of the color list", () => {
          test("return the color at the head of the list", () => {
            const inputColorList = ["color-1", "color-2", "color-3"]
            const result = ColorPicker.fromSeed(4, inputColorList)

            expect(result).toEqual("color-1")
          })
        })
      })
    })
  })
})
