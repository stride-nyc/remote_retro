import React from "react"
import { DndContext } from "@dnd-kit/core"

import CategoryColumn from "./category_column"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/columnar_board_layout.css"

const ColumnarBoardLayout = props => {
  const { categories, actions, ideas } = props

  const handleDragEnd = event => {
    const { active, over } = event

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

  return (
    <div className={styles.categoryColumnsWrapper}>
      <DndContext onDragEnd={handleDragEnd}>
        {categories.map(category => (
          <CategoryColumn {...props} category={category} key={category} />
        ))}
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
