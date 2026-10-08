export default {
  init() {
    const saved = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    document.documentElement.setAttribute("data-theme", saved || (prefersDark ? "dark" : "light"))
  },

  toggle() {
    const html = document.documentElement
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark"
    html.setAttribute("data-theme", next)
    localStorage.setItem("theme", next)
  },
}
