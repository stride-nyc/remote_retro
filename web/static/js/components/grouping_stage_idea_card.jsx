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

    let style
    if (idea.x) {
      style = {
        ...touchEventDragPreviewStyles,
        position: "fixed",
        top: 0,
        left: 0,
        transform: `translate(${idea.x}px,${idea.y}px)`,
      }
    } else {
      style = touchEventDragPreviewStyles
    }

    return connectDragSource(
      <div className={styles.wrapper} style={style}>
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
