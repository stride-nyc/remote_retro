import React from "react"
import Idea from "./idea"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/category_column.css"

function CategoryColumn(props) {
  const categoryToEmoticonUnicodeMap = {
    happy: "😊",
    sad: "😥",
    confused: "🤔",
    "action-item": "🚀",
  }

  const { category, ideas, currentUser, retroChannel } = props
  const emoticonUnicode = categoryToEmoticonUnicodeMap[category]
  const filteredIdeas = ideas.filter(idea => idea.category === category)
  const sortedIdeas = filteredIdeas.sort((a, b) => (a.inserted_at > b.inserted_at))
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
        <i className={styles.icon}>{emoticonUnicode}</i>
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
