export default {
  init() {
    const saved = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    document.documentElement.dataset.theme = saved || (prefersDark ? "dark" : "light")
  },
}
