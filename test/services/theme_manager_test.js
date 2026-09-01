import ThemeManager from "../../web/static/js/services/theme_manager"

const stubMatchMedia = (prefersDark) => {
  window.matchMedia = (query) => ({
    matches: prefersDark && query === "(prefers-color-scheme: dark)",
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
  })
}

describe("ThemeManager", () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
    stubMatchMedia(false)
  })

  describe(".init()", () => {
    context("when no preference is saved and OS is not in dark mode", () => {
      it("sets data-theme to 'light' on the html element", () => {
        ThemeManager.init()

        expect(document.documentElement.dataset.theme).to.eql("light")
      })
    })

    context("when no preference is saved and OS prefers dark mode", () => {
      it("sets data-theme to 'dark' on the html element", () => {
        stubMatchMedia(true)

        ThemeManager.init()

        expect(document.documentElement.dataset.theme).to.eql("dark")
      })
    })
  })
})
