import React from "react"

import LowerThird from "./lower_third"
import IdeaGroup from "./idea_group"

import * as AppPropTypes from "../prop_types"

import groupingStageStyles from "./css_modules/grouping_stage.css"

const GroupLabelingStage = props => {
  const { groups } = props

  return (
    <div className={groupingStageStyles.wrapper}>
      <div style={{ flex: 1 }}>
        {groups.map(group => {
          return <IdeaGroup key={group.id} />
        })}
      </div>

      <LowerThird {...props} />
    </div>
  )
}

GroupLabelingStage.propTypes = {
  groups: AppPropTypes.groups.isRequired,
}

export default GroupLabelingStage
