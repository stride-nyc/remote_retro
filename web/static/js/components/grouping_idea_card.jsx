import React, { useEffect, useRef } from "react"
import PropTypes from "prop-types"
import { useDraggable } from "@dnd-kit/core"
import isFinite from "lodash/isFinite"
import cx from "classnames"

import * as AppPropTypes from "../prop_types"

import ColorPicker from "../services/color_picker"
import { COLLISION_BUFFER } from "../services/collisions"
import styles from "./css_modules/grouping_idea_card.css"

const COLOR_BLACK = "#000000"

export function GroupingIdeaCard({
  idea,
  className = "",
  userOptions: { highContrastOn },
  actions,
  id,
}) {
  const cardRef = useRef(null)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id || `idea-${idea.id}`,
    data: { idea },
  })

  const updateStoreWithBoundingClientRectangleAttributes = () => {
    if (cardRef.current) {
      const { height, width, x, y } = cardRef.current.getBoundingClientRect()
      actions.updateIdea(idea.id, { height, width, x, y })
    }
  }

  useEffect(() => {
    updateStoreWithBoundingClientRectangleAttributes()
  }, [])

  useEffect(() => {
    // store data is replaced wholesale when the js client rejoins the channel,
    // (for example, after a laptop awakes from sleep), so we re-add the height
    // and width on updates where the idea dimensions have been stripped
    const storeDataHasBeenClearedOfDomNodeAttrs = !isFinite(idea.height)
    if (storeDataHasBeenClearedOfDomNodeAttrs) {
      updateStoreWithBoundingClientRectangleAttributes()
    }
  }, [idea])

  let style = { margin: `${COLLISION_BUFFER + 2}px ${COLLISION_BUFFER + 1}px 0 0` }

  // handles floats, integers, and doesn't return true for nulls
  const hasNumericCoordinates = isFinite(idea.x)

  if (hasNumericCoordinates) {
    const translateX = idea.x
    const translateY = idea.y
    const transformValue = `translate3d(${translateX}px,${translateY}px,0)`

    style = {
      position: "fixed",
      top: 0,
      left: 0,
      transform: transformValue,
      WebkitTransform: transformValue,
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

  // Add dnd-kit transform when dragging
  if (isDragging && transform) {
    const dndTransform = `translate3d(${transform.x}px, ${transform.y}px, 0)`
    style = {
      ...style,
      transform: dndTransform,
      WebkitTransform: dndTransform,
      zIndex: 999,
      opacity: 0.8,
    }
  }

  const classes = cx("idea-card", styles.wrapper, className, {
    "in-edit-state": idea.inEditState,
  })

  return (
    <p
      ref={node => {
        setNodeRef(node)
        cardRef.current = node
      }}
      className={classes}
      style={style}
      data-category={idea.category}
      {...attributes}
      {...listeners}
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

GroupingIdeaCard.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  actions: AppPropTypes.actions.isRequired,
  className: PropTypes.string,
  userOptions: AppPropTypes.userOptions.isRequired,
  id: PropTypes.string,
}

export default GroupingIdeaCard
