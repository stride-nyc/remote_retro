import React, { Component } from "react"
import PropTypes from "prop-types"
import { DragSource } from "react-dnd"
import { getEmptyImage } from "react-dnd-html5-backend"
import isFinite from "lodash/isFinite"
import cx from "classnames"

import * as AppPropTypes from "../prop_types"

import { dragSourceSpec, collect } from "./draggable_idea_content"
import ColorPicker from "../services/color_picker"
import { COLLISION_BUFFER } from "../services/collisions"
import styles from "./css_modules/grouping_idea_card.css"

const COLOR_BLACK = "#000000"

export class GroupingIdeaCard extends Component {
  componentDidMount() {
    this._updateStoreWithBoundingClientRectangleAttributes()

    // Use empty image as a drag preview so browsers don't draw it.
    // Instead, we shift the actual DOM node being dragged, so that we can dynamically update its
    // shadow colors when idea comes in contact with other ideas
    const { connectDragPreview } = this.props
    connectDragPreview(getEmptyImage(), {
      // IE fallback: specify that we'd rather screenshot the node
      // when it already knows it's being dragged so we can hide it with CSS.
      captureDraggingState: true,
    })
  }

  componentDidUpdate() {
    const { idea } = this.props

    // store data is replaced wholesale when the js client rejoins the channel,
    // (for example, after a laptop awakes from sleep), so we re-add the height
    // and width on updates where the idea dimensions have been stripped
    const storeDataHasBeenClearedOfDomNodeAttrs = !isFinite(idea.height)
    if (storeDataHasBeenClearedOfDomNodeAttrs) {
      this._updateStoreWithBoundingClientRectangleAttributes()
    }
  }

  _updateStoreWithBoundingClientRectangleAttributes() {
    const { actions, idea } = this.props
    const { height, width, x, y } = this.cardNode.getBoundingClientRect()

    actions.updateIdea(idea.id, { height, width, x, y })
  }

  render() {
    const {
      idea,
      className = "",
      connectDragSource = node => node,
      userOptions: { highContrastOn },
      actions = null,
    } = this.props

    let style = { margin: `${COLLISION_BUFFER + 2}px ${COLLISION_BUFFER + 1}px 0 0` }

    // handles floats, integers, and doesn't return true for nulls
    const hasNumericCoordinates = isFinite(idea.x)

    if (hasNumericCoordinates) {
      const transform = `translate3d(${idea.x}px,${idea.y}px,0)`

      style = {
        position: "fixed",
        top: 0,
        left: 0,
        transform,
        WebkitTransform: transform,
      }
    }

    if (idea.ephemeralGroupingId) {
      const color = highContrastOn ? COLOR_BLACK : ColorPicker.fromSeed(idea.ephemeralGroupingId)
      style = {
        ...style,
        boxShadow: `0 0 0px 2px ${color}`,
        borderColor: color,
      }
    }

    const classes = cx("idea-card", styles.wrapper, className, {
      "in-edit-state": idea.inEditState,
    })

    return connectDragSource(
      <p
        className={classes}
        style={style}
        data-category={idea.category}
        ref={cardNode => { this.cardNode = cardNode }}
      >
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

GroupingIdeaCard.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  actions: AppPropTypes.actions.isRequired,
  className: PropTypes.string.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  userOptions: AppPropTypes.userOptions.isRequired,
}

export default DragSource(
  "GROUPING_STAGE_IDEA_CARD",
  dragSourceSpec,
  collect
)(GroupingIdeaCard)
