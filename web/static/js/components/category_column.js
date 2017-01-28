import React from "react"

function CategoryColumn(props) {
  return (
    <section>
      <p>Ideas:</p>
      <ul>
        { props.ideas.map(idea => <li key={idea.body}>{idea.body}</li>) }
      </ul>
    </section>
  )
}

CategoryColumn.propTypes = {
  ideas: React.PropTypes.array.isRequired
}

export default CategoryColumn
