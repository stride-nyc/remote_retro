import React, { Component } from "react"
import PropTypes from "prop-types"
import { DragSource } from "react-dnd"
import { getEmptyImage } from "react-dnd-html5-backend"
import randomColor from "randomcolor"
import cx from "classnames"

import * as AppPropTypes from "../prop_types"

import { dragSourceSpec, collect } from "./draggable_idea_content"
import styles from "./css_modules/grouping_stage_idea_card.css"

export class GroupingStageIdeaCard extends Component {
  componentDidMount() {
    const { connectDragPreview, actions, idea } = this.props

    const { height, width, x, y } = this.cardNode.getBoundingClientRect()

    actions.updateIdea(idea.id, { height, width, x, y })

    // Use empty image as a drag preview so browsers don't draw it.
    // Instead, we shift the actual DOM node being dragged, so that we can dynamically update its
    // shadow colors when idea comes in contact with other ideas
    connectDragPreview(getEmptyImage(), {
      // IE fallback: specify that we'd rather screenshot the node
      // when it already knows it's being dragged so we can hide it with CSS.
      captureDraggingState: true,
    })
  }

  render() {
    const {
      idea,
      connectDragSource,
    } = this.props

    let style = {}

    // handles floats, integers, and doesn't return true for nulls
    const hasNumericCoordinates = Number.isFinite(idea.x)

    if (hasNumericCoordinates) {
      const transform = `translate(${idea.x}px,${idea.y}px)`

      style = {
        position: "fixed",
        top: 0,
        left: 0,
        transform,
        WebkitTransform: transform,
      }
    }

    if (idea.ephemeralGroupingId) {
      const color = randomColor({ seed: idea.ephemeralGroupingId })
      style = {
        ...style,
        boxShadow: `0 0 1px 1px ${color}`,
        borderColor: color,
      }
    }

    const classes = cx("idea-card", styles.wrapper, {
      "in-edit-state": idea.inEditState,
    })

    return connectDragSource(
      <p className={classes} style={style} ref={cardNode => { this.cardNode = cardNode }}>
        {idea.body}

        {idea.editSubmitted && (
          <span className={styles.loadingWrapper}>
            <span className="ui active mini loader" />
          </span>
        )}
      </p>
    )
  }
}

GroupingStageIdeaCard.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  actions: AppPropTypes.actions,
  connectDragSource: PropTypes.func,
  connectDragPreview: PropTypes.func,
}

GroupingStageIdeaCard.defaultProps = {
  connectDragSource: node => node,
  connectDragPreview: null,
  actions: null,
}

export default DragSource(
  "GROUPING_STAGE_IDEA_CARD",
  dragSourceSpec,
  collect
)(GroupingStageIdeaCard)
