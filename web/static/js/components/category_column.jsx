import React from "react"
import Idea from "./idea"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/category_column.css"

const CategoryColumn = props => {
  const categoryToEmoticonUnicodeMap = {
    happy: '/images/happy.svg',
    sad: '/images/sad.svg',
    confused: '/images/confused.svg',
    "action-item": '/images/rocket-ship.svg',
  }

  const { category, ideas, currentUser, retroChannel } = props
  const emoticonUnicode = categoryToEmoticonUnicodeMap[category]
  const filteredIdeas = ideas.filter(idea => idea.category === category)
  const sortedIdeas = filteredIdeas.sort((a, b) => a.id - b.id)
  const ideasList = sortedIdeas.map(idea => (
    <Idea
      idea={idea}
      key={idea.id}
      currentUser={currentUser}
      retroChannel={retroChannel}
    />
  ))

  return (
    <section className={`${category} ${styles.index} column`}>
      <div className={` ${styles.columnHead} ui center aligned basic segment`}>
        <img src={emoticonUnicode} height="20" width="20" />
        <p><strong>{category}</strong></p>
      </div>
      <div className={`ui fitted divider ${styles.divider}`} />
      <ul className={`${category} ${styles.list} ideas`}>
        {ideasList}
      </ul>
    </section>
  )
}

CategoryColumn.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  currentUser: AppPropTypes.user.isRequired,
  category: AppPropTypes.category.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
}

export default CategoryColumn
