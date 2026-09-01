export default {
  init() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    document.documentElement.dataset.theme = prefersDark ? "dark" : "light"
  },
}
