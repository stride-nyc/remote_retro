import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useDroppable, DndContext } from "@dnd-kit/core";
import cx from "classnames";
import orderBy from "lodash/orderBy";

import GroupingIdeaCard from "./grouping_idea_card";
import DragCoordinates from "../services/drag_coordinates";
import * as AppPropTypes from "../prop_types";
import styles from "./css_modules/grouping_board.css";

const IDEA_COUNT_AT_WHICH_TO_TRIGGER_REAL_ESTATE_PRESERVATION = 35;

const GroupingBoard = ({ ideas, actions, userOptions }) => {
  const { isOver, setNodeRef } = useDroppable({ id: "GROUPING_STAGE_IDEA_CARD" });

  const eligibleDragAreaClassname = cx(styles.eligibleDragArea, "grouping-board");
  const sideGutterClassname = cx(styles.sideGutter, "ui inverted basic padded segment");
  const bottomGutterClassname = cx(styles.bottomGutter, "ui inverted basic segment");

  const cardClassName = cx({
    minimized: ideas.length > IDEA_COUNT_AT_WHICH_TO_TRIGGER_REAL_ESTATE_PRESERVATION,
  });

  const ideasSortedByBodyLengthAscending = useMemo(
    () => orderBy(ideas, ["body.length", "id"], ["desc", "asc"]),
    [ideas]
  );

  const handleDragOver = (event) => {
    const { active } = event;
    if (!active) return;

    const draggedIdea = active.data.current;
    if (!draggedIdea) return;

    const { x, y } = DragCoordinates.reconcileMobileZoomOffsets(event);
    
    if (
      memoizedPush.id === draggedIdea.id &&
      memoizedPush.x === x &&
      memoizedPush.y === y
    ) {
      return;
    }

    memoizedPush = { id: draggedIdea.id, x, y };
    actions.ideaDraggedInGroupingStage(memoizedPush);
  };

  return (
    <DndContext onDragOver={handleDragOver}>
      <div className={styles.boardAndSideGutterWrapper}>
        <div ref={setNodeRef} className={eligibleDragAreaClassname}>
          {ideasSortedByBodyLengthAscending.map((idea) => (
            <GroupingIdeaCard
              idea={idea}
              className={cardClassName}
              key={idea.id}
              actions={actions}
              userOptions={userOptions}
            />
          ))}
        </div>
        <div className={sideGutterClassname}>
          <h2 className="ui inverted header">
            <div className="content">
              <div className="sub header">
                To ensure a consistent experience across devices, this space is non-draggable.
              </div>
            </div>
          </h2>
        </div>
      </div>
      <div className={bottomGutterClassname} />
    </DndContext>
  );
};

GroupingBoard.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  userOptions: AppPropTypes.userOptions.isRequired,
  actions: PropTypes.object.isRequired,
};

let memoizedPush = {};

export default GroupingBoard;
