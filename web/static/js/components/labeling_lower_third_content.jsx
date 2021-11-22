import React from "react"

import CenteredContentLowerThirdWrapper from "./centered_content_lower_third_wrapper"

import styles from "./css_modules/votes_left.css"

const VotingLowerThirdContent = props => {
  return (
    <CenteredContentLowerThirdWrapper {...props}>
      <div className={`${styles.index}`}>
        <h2 className="ui header">
          Labeling
          <div className="sub header">Arrive at sensible group labels</div>
        </h2>
      </div>

    </CenteredContentLowerThirdWrapper>
  )
}

export default VotingLowerThirdContent
