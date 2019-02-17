import React from "react"
import PropTypes from "prop-types"

import StageProgressionButton from "./stage_progression_button"

import * as AppPropTypes from "../prop_types"

const CenteredLowerThirdContentWrapper = props => {
  const { currentUser, children } = props
  return (
    <div className="ui stackable grid basic attached secondary center aligned segment">
      {currentUser.is_facilitator && <div className="three wide column ui computer tablet only" />}
      <div className="ten wide column">
        {children}
      </div>

      {currentUser.is_facilitator && (
        <StageProgressionButton
          {...props}
          className="three wide column"
        />
      )}
    </div>
  )
}

CenteredLowerThirdContentWrapper.propTypes = {
  currentUser: AppPropTypes.presence.isRequired,
  children: PropTypes.node.isRequired,
}

export default CenteredLowerThirdContentWrapper
