import React from "react"
import PropTypes from "prop-types"

import LowerThird from "./lower_third"
import GroupingBoard from "./grouping_board"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_generation_stage.css"

// specification for rendering a drag preview on touch devices
// https://github.com/LouisBrunner/dnd-multi-backend/tree/master/packages/react-dnd-multi-backend#preview
const generateTouchEventDragPreview = (type, item, styles) => {
  return <GroupingStageIdeaCard touchEventDragPreviewStyles={styles} idea={item.draggedIdea} />
}

const GroupingStage = props => {
  const { ideas, actions } = props

  return (
    <div className={styles.wrapper}>
      <GroupingBoard ideas={ideas} actions={actions} />
      <LowerThird {...props} />
    </div>
  )
}

GroupingStage.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  actions: PropTypes.object.isRequired,
}

export default GroupingStage
