import React from "react"

import CenteredContentLowerThirdWrapper from "./centered_content_lower_third_wrapper"
import * as AppPropTypes from "../prop_types"

const GroupLabelingLowerThirdContent = props => {
  return (
    <CenteredContentLowerThirdWrapper {...props}>
      <div className="ui header">
        Labeling

        <div className="sub header">
          Give a label to the shaped groups
        </div>
      </div>
    </CenteredContentLowerThirdWrapper>
  )
}

GroupLabelingLowerThirdContent.propTypes = {
  currentUser: AppPropTypes.presence.isRequired,
  stageConfig: AppPropTypes.stageConfig.isRequired,
}

export default GroupLabelingLowerThirdContent
