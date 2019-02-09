import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import classNames from "classnames"

import IdeaList from "./idea_list"
import IdeaDropTarget from "./idea_drop_target"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/category_column.css"
import { actions as actionCreators } from "../redux"

export const CategoryColumn = props => {
  const { category, ideas, actions } = props
  const iconHeight = 45
  const wrapperClassName = classNames(category, styles.index, "column")

  return (
    <IdeaDropTarget
      wrapperClassName={wrapperClassName}
      onDropOfIdea={idea => {
        actions.submitIdeaEditAsync({ ...idea, category })
      }}
    >
      <div className={`${styles.columnHead} ui center aligned basic segment`}>
        <img
          src={`/images/${category}.svg`}
          height={iconHeight}
          width={iconHeight}
          alt={category}
        />
        <p><strong>{category}</strong></p>
      </div>
      <div className={`ui fitted divider ${styles.divider}`} />
      {!!ideas.length &&
        <IdeaList {...props} />
      }
    </IdeaDropTarget>
  )
}

CategoryColumn.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  category: AppPropTypes.category.isRequired,
  votes: AppPropTypes.votes.isRequired,
  stage: AppPropTypes.stage.isRequired,
  actions: AppPropTypes.actions.isRequired,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryColumn)
