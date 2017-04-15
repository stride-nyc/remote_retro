import React from "react"
import Idea from "./idea"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/category_column.css"

function CategoryColumn(props) {
  const categoryToEmoticonUnicodeMap = {
    happy: "😊",
    sad: "😥",
    confused: "😕",
    "action-item": "🚀",
  }

  const emoticonUnicode = categoryToEmoticonUnicodeMap[props.category]
  const filteredIdeas = props.ideas.filter(idea => idea.category === props.category)
  const filteredIdeasList = filteredIdeas.map(idea => (
    <Idea
      idea={idea}
      key={idea.id}
      currentPresence={props.currentPresence}
      retroChannel={props.retroChannel}
    />
  ))

  return (
    <section className={`${props.category} ${styles.index} column`}>
      <div className="ui center aligned basic segment">
        <i className={styles.icon}>{emoticonUnicode}</i>
        <p><strong>{props.category}</strong></p>
      </div>
      <div className="ui fitted divider" />
      <ul className={`${props.category} ${styles.list} ideas`}>
        {filteredIdeasList}
      </ul>
    </section>
  )
}

CategoryColumn.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  currentPresence: AppPropTypes.presence,
  category: AppPropTypes.category.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
}

export default CategoryColumn
