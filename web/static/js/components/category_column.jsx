import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import IdeaList from "./idea_list"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/category_column.css"
import { actions as actionCreators } from "../redux"

export class CategoryColumn extends Component {
  state = {}

  handleDragOver = event => {
    this.setState({ draggedOver: true })
    event.preventDefault()
  }

  handleDragLeave = event => {
    const { currentTarget, relatedTarget } = event
    if (currentTarget.contains(relatedTarget)) { return }

    this.setState({ draggedOver: false })
  }

  handleDrop = event => {
    const ideaData = event.dataTransfer.getData("idea")
    if (!ideaData) { return }

    this.setState({ draggedOver: false })
    event.preventDefault()
    const { category, actions } = this.props

    const idea = JSON.parse(ideaData)

    actions.submitIdeaEditAsync({ ...idea, category })
  }

  render() {
    const { handleDragOver, handleDrop, handleDragLeave, props, state } = this
    const { category, ideas } = props
    const iconHeight = 45

    return (
      <section
        className={`${category} ${styles.index} ${state.draggedOver ? "dragged-over" : ""} column`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`${styles.columnHead} ui center aligned basic segment`}>
          <img src={`/images/${category}.svg`} height={iconHeight} width={iconHeight} alt={category} />
          <div className="ui computer tablet only centered padded grid">
            <p><strong>{category}</strong></p>
          </div>
        </div>
        <div className={`ui fitted divider ${styles.divider}`} />
        { !!ideas.length && <IdeaList {...props} /> }

        <span className="overlay" />
      </section>
    )
  }
}

CategoryColumn.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  category: AppPropTypes.category.isRequired,
  votes: AppPropTypes.votes.isRequired,
  stage: AppPropTypes.stage.isRequired,
  actions: AppPropTypes.actions.isRequired,
}

export const mapStateToProps = ({ votes, ideas }, props) => {
  return {
    votes,
    ideas: ideas.filter(idea => idea.category === props.category),
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryColumn)
