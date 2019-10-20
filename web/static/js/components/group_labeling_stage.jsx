import React from "react"
import { connect } from "react-redux"
import { selectors } from "../redux/index"

import LowerThird from "./lower_third"
import IdeaGroup from "./idea_group"

import * as AppPropTypes from "../prop_types"

import groupingStageStyles from "./css_modules/grouping_stage.css"

export const GroupLabelingStage = props => {
  const { groupsWithAssociatedIdeas } = props

  return (
    <div className={groupingStageStyles.wrapper}>
      <div style={{ flex: 1 }}>
        {groupsWithAssociatedIdeas.map(group => {
          return <IdeaGroup key={group.id} />
        })}
      </div>

      <LowerThird {...props} />
    </div>
  )
}

GroupLabelingStage.propTypes = {
  groupsWithAssociatedIdeas: AppPropTypes.groups.isRequired,
}

const mapStateToProps = state => ({
  groupsWithAssociatedIdeas: selectors.groupsWithAssociatedIdeas(state),
})

export default connect(mapStateToProps)(GroupLabelingStage)
