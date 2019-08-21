const PALETTE_JS_COLORS = ["#ff0029", "#377eb8", "#66a61e", "#984ea3", "#00d2d5", "#ff7f00", "#af8d00", "#7f80cd", "#b3e900", "#c42e60", "#a65628", "#f781bf", "#8dd3c7", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#fccde5", "#bc80bd", "#ffed6f", "#c4eaff", "#cf8c00", "#1b9e77", "#d95f02", "#e7298a", "#e6ab02", "#a6761d", "#0097ff", "#00d067", "#000000", "#969696"]

export default {
  fromSeed: (seed, colors = PALETTE_JS_COLORS) => {
    if (seed < 1) { throw new Error("Seed must be a positive integer.") }

    const index = (seed - 1) % colors.length
    return colors[index]
  },
}
