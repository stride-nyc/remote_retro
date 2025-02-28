import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types"; // ✅ Import PropTypes
import { useDraggable } from "@dnd-kit/core";
import isFinite from "lodash/isFinite";
import cx from "classnames";

import * as AppPropTypes from "../prop_types";
import ColorPicker from "../services/color_picker";
import { COLLISION_BUFFER } from "../services/collisions";
import styles from "./css_modules/grouping_idea_card.css";

const COLOR_BLACK = "#000000";

const GroupingIdeaCard = ({ idea, actions, className = "", userOptions: { highContrastOn } }) => {
  const cardRef = useRef(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `idea-${idea.id}`,
    data: { idea },
  });

  useEffect(() => {
    if (cardRef.current) {
      const { height, width, x, y } = cardRef.current.getBoundingClientRect();
      actions.updateIdea(idea.id, { height, width, x, y });
    }
  }, [idea.id, actions]);

  let style = {
    margin: `${COLLISION_BUFFER + 2}px ${COLLISION_BUFFER + 1}px 0 0`,
    opacity: isDragging ? 0.5 : 1, // Dim while dragging
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    position: transform ? "fixed" : undefined,
    top: transform ? 0 : undefined,
    left: transform ? 0 : undefined,
  };

  if (idea.ephemeralGroupingId) {
    const color = highContrastOn ? COLOR_BLACK : ColorPicker.fromSeed(idea.ephemeralGroupingId);
    style = { ...style, boxShadow: `0 0 0px 2px ${color}`, borderColor: color };
  }

  const classes = cx("idea-card", styles.wrapper, className, {
    "in-edit-state": idea.inEditState,
  });

  return (
    <p
      ref={(node) => {
        setNodeRef(node);
        cardRef.current = node;
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
  );
};

GroupingIdeaCard.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  actions: AppPropTypes.actions.isRequired,
  className: PropTypes.string,
  userOptions: AppPropTypes.userOptions.isRequired,
};

export default GroupingIdeaCard;
