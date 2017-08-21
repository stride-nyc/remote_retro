import React, { Component, PropTypes } from "react"
import FlipMove from "react-flip-move"
import Idea from "./idea"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/category_column.css"

class CategoryColumn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      animateSort: props.stage === "action-items" || props.stage === "action-item-distribution",
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.stage === "voting" && nextProps.stage === "action-items") {
      const timeout = setTimeout(() => {
        this.setState({ animateSort: true })
        clearTimeout(timeout)
      }, 1000)
    }
  }

  render() {
    const { category, ideas } = this.props
    const filteredIdeas = ideas.filter(idea => idea.category === category)
    const iconHeight = 45

    let sortedIdeas
    if (this.state.animateSort) {
      sortedIdeas = filteredIdeas.sort((a, b) => b.vote_count - a.vote_count)
    } else {
      sortedIdeas = filteredIdeas.sort((a, b) => a.id - b.id)
    }

    const ideasList = (
      <FlipMove duration={750} easing="ease" enterAnimation="none" leaveAnimation="none">
        {sortedIdeas.map(idea => <div key={idea.id}><Idea {...this.props} idea={idea} /></div>)}
      </FlipMove>
    )

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
}

CategoryColumn.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  category: AppPropTypes.category.isRequired,
  stage: PropTypes.string.isRequired,
}

export default CategoryColumn
