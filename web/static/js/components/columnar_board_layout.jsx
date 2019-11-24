import React from "react"

import CategoryColumn from "./category_column"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/columnar_board_layout.css"

const ColumnarBoardLayout = props => {
  const { categories } = props

  return (
    <div className={`ui equal width padded grid ${styles.categoryColumnsWrapper}`}>
      {categories.map(category => (
        <CategoryColumn {...props} category={category} key={category} />
      ))}
    </div>
  )
}

ColumnarBoardLayout.propTypes = {
  currentUser: AppPropTypes.presence.isRequired,
  ideas: AppPropTypes.ideas.isRequired,
  stage: AppPropTypes.stage.isRequired,
  categories: AppPropTypes.categories.isRequired,
}

export default ColumnarBoardLayout
