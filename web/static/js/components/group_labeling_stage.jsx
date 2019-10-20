import React from "react"
import PropTypes from "prop-types"

import LowerThird from "./lower_third"

import * as AppPropTypes from "../prop_types"

import groupingStageStyles from "./css_modules/grouping_stage.css"

const GroupLabelingStage = props => {
  return (
    <div className={groupingStageStyles.wrapper}>
      <LowerThird {...props} />
    </div>
  )
}

GroupLabelingStage.propTypes = {}

export default GroupLabelingStage
