import React from "react"

import CenteredContentLowerThirdWrapper from "./centered_content_lower_third_wrapper"
import * as AppPropTypes from "../prop_types"

const GroupNamingLowerThirdContent = props => {
  return (
    <CenteredContentLowerThirdWrapper {...props}>
      <div className="ui header">
        Naming

        <div className="sub header">
          Give a name to each of the groups
        </div>
      </div>
    </CenteredContentLowerThirdWrapper>
  )
}

GroupNamingLowerThirdContent.propTypes = {
  currentUser: AppPropTypes.presence.isRequired,
  stageConfig: AppPropTypes.stageConfig.isRequired,
}

export default GroupNamingLowerThirdContent
