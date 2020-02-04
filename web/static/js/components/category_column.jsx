import React, { Component } from "react"
import PropTypes from "prop-types"
import { DropTarget } from "react-dnd"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import cx from "classnames"

import IdeaColumnListContainer from "./idea_column_list_container"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/category_column.css"
import { actions as actionCreators } from "../redux"

export class CategoryColumn extends Component {
  state = {}

  render() {
    const {
      category,
      categoryDisplayStringOverride,
      ideas,
      connectDropTarget,
      draggedOver,
    } = this.props

    const iconHeight = 23
    const wrapperClasses = cx(category, "column", styles.index, {
      "dragged-over": draggedOver,
    })

    return connectDropTarget(
      <section className={wrapperClasses}>
        <div className={`${styles.columnHead} ui center aligned basic segment`}>
          <img
            src={`/images/${category}.svg`}
            height={iconHeight}
            width={iconHeight}
            alt={category}
          />
          <p className="ui medium header">{categoryDisplayStringOverride || category}</p>
        </div>
        <div className={`ui fitted divider ${styles.divider}`} />
        { !!ideas.length && <IdeaColumnListContainer {...this.props} /> }

        <span className="overlay" />
      </section>
    )
  }
}

CategoryColumn.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  category: AppPropTypes.category.isRequired,
  categoryDisplayStringOverride: PropTypes.string,
  votes: AppPropTypes.votes.isRequired,
  stage: AppPropTypes.stage.isRequired,
  actions: AppPropTypes.actions.isRequired,
  connectDropTarget: PropTypes.func,
  draggedOver: PropTypes.bool,
}

CategoryColumn.defaultProps = {
  categoryDisplayStringOverride: null,
  connectDropTarget: node => node,
  draggedOver: false,
}

export const mapStateToProps = ({ votes, ideas, alert, ideaGenerationCategories }, props) => {
  return {
    votes,
    ideas: ideas.filter(idea => idea.category === props.category),
    alert,
    ideaGenerationCategories,
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
})

// http://react-dnd.github.io/react-dnd/docs/api/drop-target#drop-target-specification
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
