import React from "react"
import PropTypes from "prop-types"

import CenteredTextStageWrapper from "./centered_text_stage_wrapper"

const primeDirectiveMarkup = (
  <p>
    Regardless of what we discover,
    <br />
    we understand and truly believe
    <br />
    that everyone did the best job they could,
    <br />
    given what they knew at the time,
    <br />
    their skills and abilities,
    <br />
    the resources available,
    <br />
    and the situation at hand.
  </p>
)

const PrimeDirectiveStage = props => {
  return (
    <CenteredTextStageWrapper
      {...props}
      headerText="The Prime Directive"
      bodyMarkup={primeDirectiveMarkup}
    />
  )
}

PrimeDirectiveStage.propTypes = {
  stageConfig: PropTypes.object.isRequired,
}

export default PrimeDirectiveStage
