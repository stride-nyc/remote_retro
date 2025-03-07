import React from "react"
import PropTypes from "prop-types"
import { DndContext, DragOverlay, pointerWithMouseSensor } from "@dnd-kit/core"
import { GroupingIdeaCard } from "./grouping_idea_card"

const DndProvider = ({ children, onDragStart, onDragEnd, onDragOver, activeDragItem }) => {
  return (
    <DndContext
      sensors={[pointerWithMouseSensor]}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      {children}
      <DragOverlay>
        {activeDragItem && (
          <GroupingIdeaCard
            idea={activeDragItem.idea}
            className="dragging"
            userOptions={{ highContrastOn: false }}
            actions={{ updateIdea: () => {} }}
          />
        )}
      </DragOverlay>
    </DndContext>
  )
}

DndProvider.propTypes = {
  children: PropTypes.node.isRequired,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDragOver: PropTypes.func,
  activeDragItem: PropTypes.object,
}

export default DndProvider
