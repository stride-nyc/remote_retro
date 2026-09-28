import React from "react"

// eslint-disable-next-line import/no-cycle -- intentional config-driven component resolution
import CategoryColumn from "./category_column"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/columnar_board_layout.css"

function ColumnarBoardLayout(props) {
  const { categories } = props

  return (
    <div className={styles.categoryColumnsWrapper}>
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
