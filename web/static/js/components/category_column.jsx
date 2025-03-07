import React from "react"
import PropTypes from "prop-types"
import { useDroppable } from "@dnd-kit/core"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import cx from "classnames"

import IdeaColumnListContainer from "./idea_column_list_container"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/category_column.css"
import { actions as actionCreators } from "../redux"

export const CategoryColumn = props => {
  const {
    category,
    categoryDisplayStringOverride = null,
    ideas,
  } = props

  const { isOver, setNodeRef } = useDroppable({
    id: `category-${category}`,
    data: { category },
  });

  const iconHeight = 23
  const wrapperClasses = cx(category, "column", styles.index, {
    "dragged-over": isOver,
  })

  return (
    <section className={wrapperClasses} ref={setNodeRef}>
      <div className={`${styles.columnHead} ui center aligned basic segment`}>
        <img
          src={`${ASSET_DOMAIN}/images/${category}.svg`}
          height={iconHeight}
          width={iconHeight}
          alt={category}
        />
        <p className="ui medium header">{categoryDisplayStringOverride || category}</p>
      </div>
      <div className={`ui fitted divider ${styles.divider}`} />
      { !!ideas.length && <IdeaColumnListContainer {...props} /> }

      <span className="overlay" />
    </section>
  )
}

CategoryColumn.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  category: AppPropTypes.category.isRequired,
  categoryDisplayStringOverride: PropTypes.string,
  votes: AppPropTypes.votes.isRequired,
  stage: AppPropTypes.stage.isRequired,
  actions: AppPropTypes.actions.isRequired,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryColumn)
