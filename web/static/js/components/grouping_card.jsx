import React, { useCallback, forwardRef } from "react"
import PropTypes from "prop-types"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import cx from "classnames"

import * as AppPropTypes from "../prop_types"
import ColorPicker from "../services/color_picker"

import styles from "./css_modules/grouping_card.css"

const COLOR_BLACK = "#000000"

const GroupingCard = forwardRef(
  (
    {
      idea,
      isActive,
      currentUser,
      groupId,
      userOptions: { highContrastOn },
      children,
    }, ref
  ) => {
    const { id, category, x: left = 0, y: top = 0, dragging_user_id: draggingUserId } = idea
    const { attributes, listeners, setNodeRef: draggableRef, transform } = useDraggable({ id })

    const setRefs = useCallback(element => {
      draggableRef(element)

      if (!ref) return
      if (typeof ref === "function") {
        ref(element)
      } else {
        ref.current = element
      }
    }, [draggableRef, ref])

    const isDifferentUserDragging = draggingUserId && draggingUserId !== currentUser.id

    console.log("left", left)

    const style = {
      position: "relative",
      top,
      left,
      transform: CSS.Translate.toString(transform),
      margin: "4px 0 0 4px",
      WebkitTransform: CSS.Translate.toString(transform),
      opacity: isActive || isDifferentUserDragging ? 0.5 : 1,
      cursor: isDifferentUserDragging ? "not-allowed" : "move",
    }

    if (groupId) {
      const color = highContrastOn ? COLOR_BLACK : ColorPicker.fromSeed(groupId)
      style.boxShadow = `0 0 0px 2px ${color}`
      style.border = `1px solid ${color}`
    }

    const classes = cx("idea-card", styles.wrapper)

    const conditionalDraggingProps = isDifferentUserDragging ? {} : { ...listeners, ...attributes }

    return (
      <p
        className={classes}
        ref={setRefs}
        style={style}
        data-category={category}
        {...conditionalDraggingProps}
      >
        {children}
      </p>
    )
  }
)

GroupingCard.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  isActive: PropTypes.bool,
  currentUser: AppPropTypes.presence.isRequired,
  groupId: PropTypes.number,
  userOptions: AppPropTypes.userOptions.isRequired,
  children: PropTypes.node.isRequired,
}

export default GroupingCard
