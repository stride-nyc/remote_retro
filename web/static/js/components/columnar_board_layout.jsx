import React, { useState } from "react"
import { DndContext, DragOverlay } from "@dnd-kit/core"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import IdeaContentBase from "./idea_content_base"

import CategoryColumn from "./category_column"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/columnar_board_layout.css"

const ColumnarBoardLayout = props => {
  const { categories, actions, ideas } = props
  const [, setActiveId] = useState(null)
  const [activeIdea, setActiveIdea] = useState(null)

  const handleDragStart = event => {
    const { active } = event
    setActiveId(active.id)

    const idea = ideas.find(idea => idea.id === parseInt(active.id, 10))
    if (idea) {
      setActiveIdea(idea)
    }
  }

  const handleDragEnd = event => {
    const { active, over } = event

    setActiveIdea(null)

    if (!over) return

    const ideaId = active.id
    const idea = ideas.find(idea => idea.id === parseInt(ideaId, 10))

    if (!idea) return

    const targetCategory = over.data.current.category

    if (idea.category === targetCategory) return

    actions.submitIdeaEditAsync({
      id: idea.id,
      body: idea.body,
      assignee_id: idea.assignee_id,
      category: targetCategory,
    })
  }

  console.log(activeIdea)

  return (
    <div className={styles.categoryColumnsWrapper}>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {categories.map(category => (
          <CategoryColumn {...props} category={category} key={category} />
        ))}
        <DragOverlay dropAnimation={null}>
          {/* Display the actual component and hide the component being dragged? */}
          {activeIdea ? (
            <div
              className="idea-overlay"
              // TODO: Stylesheet not inline
              style={{
                background: "pink",
                boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                borderRadius: "3px",
                opacity: 0.8,
                cursor: "move",
              }}
            >
              <IdeaContentBase idea={activeIdea} {...props} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

ColumnarBoardLayout.propTypes = {
  currentUser: AppPropTypes.presence.isRequired,
  ideas: AppPropTypes.ideas.isRequired,
  stage: AppPropTypes.stage.isRequired,
  categories: AppPropTypes.categories.isRequired,
  actions: AppPropTypes.actions.isRequired,
}

export default ColumnarBoardLayout
