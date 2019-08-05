export default {
  reconcileMobileZoomOffsets: monitor => {
    // http://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor
    const { x, y } = monitor.getSourceClientOffset()

    // account for page offsets when mobile users have 'pinch zoomed'
    return { x: x + pageXOffset, y: y + pageYOffset }
  },
}
