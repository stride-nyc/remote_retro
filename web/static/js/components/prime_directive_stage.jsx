import React, { PropTypes } from "react"

import UserList from "./user_list"
import StageProgressionButton from "./stage_progression_button"
import PrimeDirective from "./prime_directive"

const PrimeDirectiveStage = props => {
  const { isFacilitator, progressionConfig } = props
  return (
    <div className="ui centered grid">
      <PrimeDirective />
      <UserList {...props} />
      <div className="">
        { isFacilitator &&
          <StageProgressionButton
            {...props}
            config={progressionConfig}
          />
        }
      </div>
    </div>
  )
}

PrimeDirectiveStage.propTypes = {
  isFacilitator: PropTypes.bool.isRequired,
  progressionConfig: PropTypes.object.isRequired,
}

export default PrimeDirectiveStage
