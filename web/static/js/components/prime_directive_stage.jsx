import React, { PropTypes } from "react"

import UserList from "./user_list"
import StageProgressionButton from "./stage_progression_button"
import PrimeDirective from "./prime_directive"

const PrimeDirectiveStage = props => {
  const { isFacilitator, progressionConfig } = props
  return (
    <div className="ui centered grid">
      <div className="thirteen wide mobile eight wide tablet four wide computer column">
        <PrimeDirective />
      </div>
      <div className="row">
        <UserList {...props} />
      </div>
      <div className="row">
        <div className="thirteen wide mobile eight wide tablet four wide computer column">
          { isFacilitator && <StageProgressionButton {...props} config={progressionConfig} /> }
        </div>
      </div>
    </div>
  )
}

PrimeDirectiveStage.propTypes = {
  isFacilitator: PropTypes.bool.isRequired,
  progressionConfig: PropTypes.object.isRequired,
}

export default PrimeDirectiveStage
