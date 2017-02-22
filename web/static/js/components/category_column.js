import React from "react"

function CategoryColumn(props) {
  const categoryToEmoticonUnicodeMap = {
    happy: "😊",
    sad: "😥",
    confused: "😕",
    "action-item": "🚀"
  }

  const emoticonUnicode = categoryToEmoticonUnicodeMap[props.category]
  const filteredIdeas = props.ideas.filter(idea => idea.category === props.category)

  return (
    <section className="column">
      <div className="ui center aligned basic segment">
        <i>{ emoticonUnicode }</i>
        <p><a>@{ props.category }</a></p>
      </div>
      <div className="ui divider"></div>
      <ul className={ `${props.category} ideas ui divided list` }>
        { filteredIdeas.map((idea, index) => <li className="item" key={index}>{idea.body}</li>) }
      </ul>
    </section>
  )
}

CategoryColumn.propTypes = {
  ideas: React.PropTypes.array.isRequired,
  category: React.PropTypes.string.isRequired,
}

export default CategoryColumn
