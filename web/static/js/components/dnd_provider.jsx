import React, { useState } from "react"
import PropTypes from "prop-types"
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { GroupingIdeaCard } from "./grouping_idea_card"
import { useDispatch } from "react-redux"
import { actions } from "../redux"

const DndProvider = ({ children }) => {
  const [activeId, setActiveId] = useState(null);
  const [activeData, setActiveData] = useState(null);
  const dispatch = useDispatch();
  
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
    
    if (event.active.data.current && event.active.data.current.idea) {
      const idea = event.active.data.current.idea;
      dispatch(actions.initiateIdeaDrag(idea));
    }
  };

  const handleDragEnd = (event) => {
    if (event.over && event.active.data.current && event.active.data.current.idea) {
      const idea = event.active.data.current.idea;
      const category = event.over.data.current ? event.over.data.current.category : null;
      
      if (category && idea.category !== category) {
        dispatch(actions.submitIdeaEditAsync({ ...idea, category }));
      }
    }
    
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
        {activeId && activeData && activeData.idea && (
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
