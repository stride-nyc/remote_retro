import React, { Component } from "react"
import PropTypes from "prop-types"
import { DragSource } from "react-dnd"
import * as AppPropTypes from "../prop_types"

import { dragSourceSpec, collect } from "./draggable_idea_content"
import styles from "./css_modules/grouping_stage_idea_card.css"

// eslint-disable-next-line
export class GroupingStageIdeaCard extends Component {
  render() {
    const {
      idea,
      touchEventDragPreviewStyles,
      connectDragSource,
    } = this.props

    return connectDragSource(
      <div className={styles.wrapper} style={touchEventDragPreviewStyles}>
        <p>{idea.body}</p>
      </div>
    )
  }
}

GroupingStageIdeaCard.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  touchEventDragPreviewStyles: PropTypes.object,
  connectDragSource: PropTypes.func,
}

GroupingStageIdeaCard.defaultProps = {
  touchEventDragPreviewStyles: {},
  connectDragSource: node => node,
}

export default DragSource(
  "GROUPING_STAGE_IDEA_CARD",
  dragSourceSpec,
  collect
)(GroupingStageIdeaCard)
