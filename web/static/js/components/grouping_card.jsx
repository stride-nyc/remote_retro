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

const GroupingCard = forwardRef(({
  id, top, left, isActive, groupId, userOptions: { highContrastOn }, actions, children,
}, ref) => {
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

  const style = {
    position: "relative",
    top,
    left,
    transform: CSS.Translate.toString(transform),
    margin: "4px 0 0 4px",
    WebkitTransform: CSS.Translate.toString(transform),
    zIndex: isActive ? 1 : 0,
    cursor: "move",
  }

  if (groupId) {
    const color = highContrastOn ? COLOR_BLACK : ColorPicker.fromSeed(groupId)
    style.boxShadow = `0 0 0px 2px ${color}`
    style.border = `1px solid ${color}`
  }

  const classes = cx("idea-card", styles.wrapper)

  return (
    <p className={classes} ref={setRefs} style={style} {...listeners} {...attributes}>
      {children}
    </p>
  )
})

GroupingCard.propTypes = {
  id: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  isActive: PropTypes.bool,
  groupId: PropTypes.number,
  userOptions: AppPropTypes.userOptions.isRequired,
  children: PropTypes.node.isRequired,
}

export default GroupingCard
