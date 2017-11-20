import React from "react"

import CategoryColumn from "./category_column"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_board.css"
import STAGES from "../configs/stages"

const { ACTION_ITEMS, CLOSED } = STAGES

const IdeaBoard = props => {
  const { stage } = props
  const categories = ["happy", "sad", "confused"]
  const showActionItem = [ACTION_ITEMS, CLOSED].includes(stage)
  if (showActionItem) { categories.push("action-item") }

  const categoryColumns = categories.map(category => (
    <CategoryColumn {...props} category={category} key={category} />
  ))

  return (
    <div className={`ui equal width padded grid ${styles.categoryColumnsWrapper}`}>
      { categoryColumns }
    </div>
  )
}

IdeaBoard.defaultProps = {
  currentUser: { is_facilitator: false },
}

IdeaBoard.propTypes = {
  currentUser: AppPropTypes.user,
  ideas: AppPropTypes.ideas.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: AppPropTypes.stage.isRequired,
  users: AppPropTypes.users.isRequired,
}

export default IdeaBoard
