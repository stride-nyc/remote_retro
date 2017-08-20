import React, { PropTypes } from "react"
import Idea from "./idea"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/category_column.css"

const CategoryColumn = props => {
  const { category, ideas, stage } = props
  const filteredIdeas = ideas.filter(idea => idea.category === category)
  const iconHeight = 45

  let sortedIdeas
  if (stage === "action-items" || stage === "action-item-distribution") {
    sortedIdeas = filteredIdeas.sort((a, b) => b.vote_count - a.vote_count)
  } else {
    sortedIdeas = filteredIdeas.sort((a, b) => a.id - b.id)
  }

  const ideasList = sortedIdeas.map(idea => <Idea {...props} idea={idea} key={idea.id} />)

  return (
    <section className={`${category} ${styles.index} column`}>
      <div className={` ${styles.columnHead} ui center aligned basic segment`}>
        <img src={`/images/${category}.svg`} height={iconHeight} width={iconHeight} alt={category} />
        <p><strong>{category}</strong></p>
      </div>
      <div className={`ui fitted divider ${styles.divider}`} />
      <ul className={`${category} ${styles.list} ideas`}>{ideasList}</ul>
    </section>
  )
}

CategoryColumn.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  category: AppPropTypes.category.isRequired,
  stage: PropTypes.string.isRequired,
}

export default CategoryColumn
