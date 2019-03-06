import React, { Component } from "react"
import PropTypes from "prop-types"
import { DropTarget } from "react-dnd"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import IdeaList from "./idea_list"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/category_column.css"
import { actions as actionCreators } from "../redux"

export class CategoryColumn extends Component {
  state = {}

  render() {
    const { category, ideas, connectDropTarget, draggedOver } = this.props
    const iconHeight = 45

    return connectDropTarget(
      <section
        className={`${category} ${styles.index} ${draggedOver ? "dragged-over" : ""} column`}
      >
        <div className={`${styles.columnHead} ui center aligned basic segment`}>
          <img src={`/images/${category}.svg`} height={iconHeight} width={iconHeight} alt={category} />
          <p><strong>{category}</strong></p>
        </div>
        <div className={`ui fitted divider ${styles.divider}`} />
        { !!ideas.length && <IdeaList {...this.props} /> }

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
  connectDropTarget: PropTypes.func,
  draggedOver: PropTypes.bool,
}

CategoryColumn.defaultProps = {
  connectDropTarget: node => node,
  draggedOver: false,
}

export const mapStateToProps = ({ votes, ideas, alert }, props) => {
  return {
    votes,
    ideas: ideas.filter(idea => idea.category === props.category),
    alert,
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
})

export const dropTargetSpec = {
  drop: (props, monitor) => {
    const { draggedIdea } = monitor.getItem()
    const { actions, category } = props

    if (draggedIdea.category === category) return

    actions.submitIdeaEditAsync({ ...draggedIdea, category })
  },
}

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  draggedOver: monitor.isOver({ shallow: true }),
})

const CategoryColumnAsDropTarget = DropTarget("IDEA", dropTargetSpec, collect)(CategoryColumn)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryColumnAsDropTarget)
