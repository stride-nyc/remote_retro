export default {
  init() {
    const saved = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    document.documentElement.dataset.theme = saved || (prefersDark ? "dark" : "light")
  },

  toggle() {
    const html = document.documentElement
    const next = html.dataset.theme === "dark" ? "light" : "dark"
    html.dataset.theme = next
    localStorage.setItem("theme", next)
  },
}
