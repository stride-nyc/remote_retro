import React from "react"
import MediaQuery from "react-responsive"
import includes from "lodash/includes"

import * as AppPropTypes from "../prop_types"
import ColumnarBoardLayout from "./columnar_board_layout"
import TabularBoardLayout from "./tabular_board_layout"
import STAGES from "../configs/stages"
import { MIN_TABLET_WIDTH } from "../configs/responsive"

const { ACTION_ITEMS, CLOSED } = STAGES

const IdeaBoard = props => {
  const { stage, categories } = props
  const showActionItem = includes([ACTION_ITEMS, CLOSED], stage)
  const renderableColumnCategories = [...categories]
  if (showActionItem) { renderableColumnCategories.push("action-item") }

  return (
    <React.Fragment>
      <MediaQuery minWidth={MIN_TABLET_WIDTH}>
        {isTabletOrAbove => {
          const Layout = isTabletOrAbove ? ColumnarBoardLayout : TabularBoardLayout

          return <Layout {...props} categories={renderableColumnCategories} />
        }}
      </MediaQuery>
    </React.Fragment>
  )
}

IdeaBoard.propTypes = {
  currentUser: AppPropTypes.presence.isRequired,
  ideas: AppPropTypes.ideas.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: AppPropTypes.stage.isRequired,
  categories: AppPropTypes.categories.isRequired,
}

export default IdeaBoard
