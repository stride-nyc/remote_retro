import React from "react"
import PropTypes from "prop-types"

import LowerThird from "./lower_third"
import GroupingBoard from "./grouping_board"

import * as AppPropTypes from "../prop_types"
import IdeasWithEphemeralGroupingIds from "../services/ideas_with_ephemeral_grouping_ids"

import styles from "./css_modules/idea_generation_stage.css"

const PORTRAIT = "portrait"

const GroupingStage = props => {
  const { ideas, actions, browser } = props

  const ideasWithEphemeralGroupingIds = IdeasWithEphemeralGroupingIds.buildFrom(ideas)

  return (
    <div className={styles.wrapper}>
      <GroupingBoard ideas={ideasWithEphemeralGroupingIds} actions={actions} />

      <LowerThird {...props} />

      {browser.orientation === PORTRAIT && (
        <div className="ui dimmer visible transition visible active">
          <div className="content">
            <h3 className="ui inverted icon header">
              You're in portrait mode.
              <p className="sub header">This stage requires landscape; rotate your device!</p>
              <i className="mobile alternate icon" />
            </h3>
          </div>
        </div>
      )}
    </div>
  )
}

GroupingStage.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  actions: PropTypes.object.isRequired,
  browser: PropTypes.object.isRequired,
}

export default GroupingStage
