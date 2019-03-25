import React from "react"
import PropTypes from "prop-types"
import { DragLayer } from "react-dnd"
import { GroupingStageIdeaCard } from "./grouping_stage_idea_card"
import styles from "./css_modules/grouping_stage_custom_drag_layer.css"

function getItemStyles(props) {
  const { currentOffset } = props

  const { x, y } = currentOffset
  const transform = `translate(${x}px, ${y}px)`

  return {
    transform,
    display: "inline-block",
    opacity: 0.5,
    WebkitTransform: transform,
  }
}

export const GroupingStageCustomDragLayer = props => {
  const { isDragging, item, initialOffset, currentOffset } = props

  if (!isDragging || !initialOffset || !currentOffset) {
    return null
  }
  return (
    <section className={styles.overlay}>
      <div style={getItemStyles(props)}>
        <GroupingStageIdeaCard idea={item.draggedIdea} />
      </div>
    </section>
  )
}

GroupingStageCustomDragLayer.propTypes = {
  isDragging: PropTypes.bool.isRequired,
  currentOffset: PropTypes.object,
  initialOffset: PropTypes.object,
  item: PropTypes.object,
}

GroupingStageCustomDragLayer.defaultProps = {
  currentOffset: null,
  initialOffset: null,
  item: null,
}

export default DragLayer(monitor => ({
  item: monitor.getItem(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
}))(GroupingStageCustomDragLayer)
