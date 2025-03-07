import React, { useState } from "react"
import PropTypes from "prop-types"
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { GroupingIdeaCard } from "./grouping_idea_card"

const DndProvider = ({ children }) => {
  const [activeId, setActiveId] = useState(null);
  const [activeData, setActiveData] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setActiveData(event.active.data.current);
  };

  const handleDragEnd = () => {
    setActiveId(null);
    setActiveData(null);
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay>
        {activeId && activeData && (
          <GroupingIdeaCard
            idea={activeData.idea}
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
}

export default DndProvider
