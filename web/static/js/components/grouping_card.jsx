import React, { useCallback, forwardRef, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import { useDraggable } from "@dnd-kit/core"
// TODO: Fix import
import { CSS } from "@dnd-kit/utilities"
import cx from "classnames"

import * as AppPropTypes from "../prop_types"

import ColorPicker from "../services/color_picker"
// TODO: Rename file name to grouping_card.css
import styles from "./css_modules/grouping_idea_card.css"

const COLOR_BLACK = "#000000"

const GroupingCard = forwardRef(
  (
    {
      id,
      top,
      left,
      isActive,
      draggingUserId,
      currentUser,
      groupId,
      userOptions: { highContrastOn },
      children,
    }, ref
  ) => {
    const { attributes, listeners, setNodeRef: draggableRef, transform } = useDraggable({ id })

    const localRef = useRef(null)
    const setRefs = useCallback(element => {
      draggableRef(element)
      localRef.current = element

      if (!ref) return

      if (typeof ref === "function") {
        ref(element)
      } else {
        ref.current = element
      }
    }, [draggableRef, ref])

    const isDifferentUserDragging = draggingUserId && draggingUserId !== currentUser.id

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

    // Probably can refactor this if we keep this approach
    return isDifferentUserDragging ? (
      <p className={classes} ref={setRefs} style={style}>
        {children}
      </p>
    ) : (
      <p className={classes} ref={setRefs} style={style} {...listeners} {...attributes}>
        {children}
      </p>
    )
  }
)

GroupingCard.propTypes = {
  id: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  isActive: PropTypes.bool,
  draggingUserId: PropTypes.number,
  currentUser: AppPropTypes.presence.isRequired,
  groupId: PropTypes.number,
  userOptions: AppPropTypes.userOptions.isRequired,
  children: PropTypes.node.isRequired,
}

export default GroupingCard
