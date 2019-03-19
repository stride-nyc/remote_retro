import React from "react"
import { Preview } from "react-dnd-multi-backend"

import LowerThird from "./lower_third"

import styles from "./css_modules/idea_generation_stage.css"

// specification for rendering a drag preview on touch devices
// https://github.com/LouisBrunner/dnd-multi-backend/tree/master/packages/react-dnd-multi-backend#preview
const generateTouchEventDragPreview = (type, item, styles) => {
  return <GroupingStageIdeaCard touchEventDragPreviewStyles={styles} idea={item.draggedIdea} />
}

export default props => {
  return (
    <div className={styles.wrapper}>
      <div style={{ flex: 1 }} />
      <LowerThird {...props} />
      <Preview generator={generateTouchEventDragPreview} />
    </div>
  )
}
