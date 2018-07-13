import React, { Component } from "react"
import { connect } from "react-redux"

import IdeaList from "./idea_list"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/category_column.css"

export class CategoryColumn extends Component {
  handleDragOver = event => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }

  handleDrop = event => {
    const ideaData = event.dataTransfer.getData("idea")
    if (!ideaData) { return }

    event.preventDefault()
    const { category, retroChannel } = this.props

    const { id, body, assignee_id: assigneeId } = JSON.parse(ideaData)

    retroChannel.push("idea_edited", {
      id,
      body,
      assigneeId,
      category,
    })
  }

  render() {
    const { handleDragOver, handleDrop, props } = this
    const { category, ideas } = props
    const iconHeight = 45

    return (
      <section className={`${category} ${styles.index} column`} onDrop={handleDrop} onDragOver={handleDragOver}>
        <div className={`${styles.columnHead} ui center aligned basic segment`}>
          <img src={`/images/${category}.svg`} height={iconHeight} width={iconHeight} alt={category} />
          <div className="ui computer tablet only centered padded grid">
            <p><strong>{category}</strong></p>
          </div>
        </div>
        <div className={`ui fitted divider ${styles.divider}`} />
        { !!ideas.length && <IdeaList {...props} /> }
      </section>
    )
  }
}

CategoryColumn.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  category: AppPropTypes.category.isRequired,
  votes: AppPropTypes.votes.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: AppPropTypes.stage.isRequired,
}

export const mapStateToProps = ({ votes, ideas }, props) => {
  return {
    votes,
    ideas: ideas.filter(idea => idea.category === props.category),
  }
}

export default connect(
  mapStateToProps
)(CategoryColumn)
