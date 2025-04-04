import React, { useState } from "react"
import { DndContext, DragOverlay } from "@dnd-kit/core"
import IdeaContentBase from "./idea_content_base"

import CategoryColumn from "./category_column"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/columnar_board_layout.css"

const ColumnarBoardLayout = props => {
  const { categories, actions, ideas } = props
  const [, setActiveId] = useState(null)
  const [activeIdea, setActiveIdea] = useState(null)

  const findIdeaById = id => ideas.find(idea => idea.id === parseInt(id, 10))

  const handleDragStart = ({ active }) => {
    setActiveId(active.id)

    const idea = findIdeaById(active.id)
    if (idea) {
      setActiveIdea(idea)
    }
  }

  const handleDragEnd = ({ active, over }) => {
    setActiveIdea(null)

    if (!over) return

    const idea = findIdeaById(active.id)
    const targetCategory = over.data.current.category

    if (idea && idea.category !== targetCategory) {
      actions.submitIdeaEditAsync({
        id: idea.id,
        body: idea.body,
        assignee_id: idea.assignee_id,
        category: targetCategory,
      })
    }
  }

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
          <div className={styles.dragIdeaWrapper}>
            <IdeaContentBase idea={activeIdea} canUserEditIdeaContents {...props} />
          </div>
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
