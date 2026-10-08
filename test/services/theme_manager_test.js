import ThemeManager from "../../web/static/js/services/theme_manager"

const stubMatchMedia = prefersDark => {
  window.matchMedia = query => ({
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
    document.documentElement.removeAttribute("data-theme")
    stubMatchMedia(false)
  })

  describe(".init()", () => {
    context("when no preference is saved and OS is not in dark mode", () => {
      it("sets data-theme to 'light' on the html element", () => {
        ThemeManager.init()

        expect(document.documentElement.getAttribute("data-theme")).to.eql("light")
      })
    })

    context("when no preference is saved and OS prefers dark mode", () => {
      it("sets data-theme to 'dark' on the html element", () => {
        stubMatchMedia(true)

        ThemeManager.init()

        expect(document.documentElement.getAttribute("data-theme")).to.eql("dark")
      })
    })

    context("when a 'dark' preference is saved in localStorage", () => {
      it("applies dark mode regardless of OS setting", () => {
        localStorage.setItem("theme", "dark")

        ThemeManager.init()

        expect(document.documentElement.getAttribute("data-theme")).to.eql("dark")
      })
    })
  })

  describe(".toggle()", () => {
    context("when the current theme is light", () => {
      it("saves 'dark' to localStorage", () => {
        document.documentElement.setAttribute("data-theme", "light")

        ThemeManager.toggle()

        expect(localStorage.getItem("theme")).to.eql("dark")
      })
    })
  })
})
