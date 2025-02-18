import React from "react"
import { Helmet } from "react-helmet-async"
import PropTypes from "prop-types"

import * as AppPropTypes from "../prop_types"
import stages from "../configs/stages"

const { GROUPING } = stages

const DEFAULT_VIEWPORT_WIDTH = "width=device-width, initial-scale=1"
const GROUPING_VIEWPORT_WIDTH = "width=1440"

// There is an implicit coupling with this component--rendered at the top of our component
// tree--and the GroupingStage component, conditionally rendered further down the tree.
// The coupling is that this component "knows" that the grouping stage can surface both
// an alert and an orientation warning, both of which we want mobile users to view at the
// normal device width setting.
//
// We house this component at the *root* our app to ensure that its render doesn't get buried
// by a conditional render at some point in the future, as we need the width to fall back to
// its default when *leaving* the grouping stage, which it won't do on unmount if we house it in the
// GroupingStage component, which we would otherwise do.
export const ViewportMetaTag = ({
  alert = null,
  stage,
  browserOrientation,
}) => {
  const noAlertToRead = !alert
  const noOrientationWarningToRead = browserOrientation === "landscape"

  const shouldUseHardcodedWidth = stage === GROUPING
    && noAlertToRead
    && noOrientationWarningToRead

  const viewportMetaContent = shouldUseHardcodedWidth
    ? GROUPING_VIEWPORT_WIDTH
    : DEFAULT_VIEWPORT_WIDTH

  return (
    <Helmet>
      <meta name="viewport" content={viewportMetaContent} />
    </Helmet>
  )
}

ViewportMetaTag.propTypes = {
  alert: AppPropTypes.alert.isRequired,
  stage: AppPropTypes.stage.isRequired,
  browserOrientation: PropTypes.string.isRequired,
}

export default ViewportMetaTag
