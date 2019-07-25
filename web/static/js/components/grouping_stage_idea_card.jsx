import React, { Component } from "react"
import PropTypes from "prop-types"
import { DragSource } from "react-dnd"
import { getEmptyImage } from "react-dnd-html5-backend"
import * as AppPropTypes from "../prop_types"

import { dragSourceSpec, collect } from "./draggable_idea_content"
import styles from "./css_modules/grouping_stage_idea_card.css"

export const DRAGGED_CARD_OPACITY = 0.5

export class GroupingStageIdeaCard extends Component {
  componentDidMount() {
    const { connectDragPreview } = this.props
    if (connectDragPreview) {
      // Use empty image as a drag preview so browsers don't draw it
      // and we can draw whatever we want on the custom drag layer instead.
      connectDragPreview(getEmptyImage(), {
        // IE fallback: specify that we'd rather screenshot the node
        // when it already knows it's being dragged so we can hide it with CSS.
        captureDraggingState: true,
      })
    }
  }

  render() {
    const {
      idea,
      connectDragSource,
    } = this.props

    let style = {}
    if (idea.x) {
      style = {
        position: "fixed",
        top: 0,
        left: 0,
        transform: `translate(${idea.x}px,${idea.y}px)`,
        WebkitTransform: `translate(${idea.x}px,${idea.y}px)`,
      }
    }

    if (idea.inEditState) {
      style = {
        ...style,
        opacity: 0.5,
      }
    }

    return connectDragSource(
      <p className={`${styles.wrapper} idea-card`} style={style}>
        {idea.body}
      </p>
    )
  }
}

GroupingStageIdeaCard.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  connectDragSource: PropTypes.func,
  connectDragPreview: PropTypes.func,
}

GroupingStageIdeaCard.defaultProps = {
  connectDragSource: node => node,
  connectDragPreview: null,
}

export default DragSource(
  "GROUPING_STAGE_IDEA_CARD",
  dragSourceSpec,
  collect
)(GroupingStageIdeaCard)
