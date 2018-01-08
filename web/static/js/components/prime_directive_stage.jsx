import React from "react"
import PropTypes from "prop-types"

import UserList from "./user_list"
import StageProgressionButton from "./stage_progression_button"
import PrimeDirective from "./prime_directive"

const PrimeDirectiveStage = props => {
  const { progressionConfig } = props
  return (
    <div className="ui centered grid">
      <div className="thirteen wide mobile eight wide tablet five wide computer column">
        <PrimeDirective />
      </div>
      <div className="row">
        <UserList {...props} />
      </div>
      <div className="row">
        <div className="thirteen wide mobile eight wide tablet four wide computer column">
          <StageProgressionButton {...props} config={progressionConfig} />
        </div>
      </div>
    </div>
  )
}

PrimeDirectiveStage.propTypes = {
  progressionConfig: PropTypes.object.isRequired,
}

export default PrimeDirectiveStage
