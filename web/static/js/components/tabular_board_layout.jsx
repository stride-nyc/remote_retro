import React from "react"
import classNames from "classnames"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { actions as actionCreators } from "../redux"

import IdeaList from "./idea_list"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/tabular_board_layout.css"

export const TabularBoardLayout = props => {
  const { categories, actions, selectedCategoryTab, votes } = props

  return (
    <React.Fragment>
      <div className="ui tabular menu">
        {categories.map(category => {
          const active = category === selectedCategoryTab

          const classes = classNames("item", category, styles.tab, { active })

          return (
            <div
              className={classes}
              key={category}
              onMouseDown={() => { actions.categoryTabSelected(category) }}
            >
              <img
                alt={category}
                src={`/images/${category}.svg`}
                height={40}
                width={40}
              />
            </div>
          )
        })}
      </div>

      <div className={styles.ideaListWrapper}>
        <IdeaList category={selectedCategoryTab} votes={votes} {...props} />
      </div>
    </React.Fragment>
  )
}

export const mapStateToProps = ({ mobile, ideas, votes }) => ({
  votes,
  selectedCategoryTab: mobile.selectedCategoryTab,
  ideas: ideas.filter(idea => idea.category === mobile.selectedCategoryTab),
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
})

TabularBoardLayout.propTypes = {
  currentUser: AppPropTypes.presence.isRequired,
  ideas: AppPropTypes.ideas.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: AppPropTypes.stage.isRequired,
  categories: AppPropTypes.categories.isRequired,
  selectedCategoryTab: AppPropTypes.category.isRequired,
  actions: AppPropTypes.actions.isRequired,
  votes: AppPropTypes.votes.isRequired,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabularBoardLayout)
