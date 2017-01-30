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
        <p><a>@{ props.category }</a></p>
      </div>
      <div className="ui divider"></div>
      <ul className={ `${props.category} ideas ui divided list` }>
        { props.ideas.map(idea => <li className="item" key={idea.body}>{idea.body}</li>) }
      </ul>
    </section>
  )
}

CategoryColumn.propTypes = {
  ideas: React.PropTypes.array.isRequired,
  category: React.PropTypes.string.isRequired,
}

export default CategoryColumn
