import React from "react"
import PropTypes from "prop-types"
import includes from "lodash/includes"

import * as AppPropTypes from "../prop_types"
import ColumnarBoardLayout from "./columnar_board_layout"
import TabularBoardLayout from "./tabular_board_layout"
import STAGES from "../configs/stages"

const { ACTION_ITEMS, CLOSED } = STAGES

const IdeaBoard = props => {
  const { stage, categories, isTabletOrAbove } = props
  const showActionItem = includes([ACTION_ITEMS, CLOSED], stage)
  const renderableColumnCategories = [...categories]
  if (showActionItem) { renderableColumnCategories.push("action-item") }

  const Layout = isTabletOrAbove ? ColumnarBoardLayout : TabularBoardLayout

  return (
    <Layout {...props} categories={renderableColumnCategories} />
  )
}

IdeaBoard.propTypes = {
  currentUser: AppPropTypes.presence.isRequired,
  ideas: AppPropTypes.ideas.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: AppPropTypes.stage.isRequired,
  categories: AppPropTypes.categories.isRequired,
  isTabletOrAbove: PropTypes.bool.isRequired,
}

export default IdeaBoard
