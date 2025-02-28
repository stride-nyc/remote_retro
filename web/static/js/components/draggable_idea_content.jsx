import React from "react";
import { useDraggable } from "@dnd-kit/core";
import isFinite from "lodash/isFinite";
import PropTypes from "prop-types";

import IdeaContentBase from "./idea_content_base";
import * as AppPropTypes from "../prop_types";

const IdeaContentConnected = ({ idea, actions, ...rest }) => {
  const { id, category, body, assignee_id } = idea; // eslint-disable-line camelcase

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `idea-${id}`,
    data: { draggedIdea: { id, category, body, assignee_id } },
  });

  // Handle drop logic in parent DndContext
  const handleDragEnd = (event) => {
    const { active } = event;
    if (!active) return;

    const droppedIdea = active.data.current;
    if (!droppedIdea) return;

    const { id, x, y } = droppedIdea;

    if (isFinite(x)) {
      actions.submitIdeaEditAsync({ id, x, y });
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : "none",
      }}
    >
      <IdeaContentBase idea={idea} {...rest} />
    </div>
  );
};

IdeaContentConnected.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
  assignee: AppPropTypes.presence,
  canUserEditIdeaContents: PropTypes.bool.isRequired,
  isTabletOrAbove: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
};

export default IdeaContentConnected;
