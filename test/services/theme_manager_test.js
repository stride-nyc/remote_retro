import ThemeManager from "../../web/static/js/services/theme_manager"

describe("ThemeManager", () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  describe(".init()", () => {
    context("when no preference is saved and OS is not in dark mode", () => {
      it("sets data-theme to 'light' on the html element", () => {
        ThemeManager.init()

        expect(document.documentElement.dataset.theme).to.eql("light")
      })
    })
  })
})
