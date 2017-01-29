import React from "react"

function CategoryColumn(props) {
  const categoryToEmoticonUnicodeMap = {
    happy: "😊",
    sad: "😥",
    confused: "😕",
  }

  const emoticonUnicode = categoryToEmoticonUnicodeMap[props.category]
  return (
    <section className="column">
      <div className="ui center aligned basic segment">
        <i>{ emoticonUnicode }</i>
        <p>:{ props.category }:</p>
      </div>
      <div className="ui divider"></div>
      <ul className="ideas">
        { props.ideas.map(idea => <li key={idea.body}>{idea.body}</li>) }
      </ul>
    </section>
  )
}

CategoryColumn.propTypes = {
  ideas: React.PropTypes.array.isRequired,
  category: React.PropTypes.string.isRequired,
}

export default CategoryColumn
