import React, { Component } from "react"
import PropTypes from "prop-types"

import LowerThird from "./lower_third"
import GroupingBoard from "./grouping_board"

import * as AppPropTypes from "../prop_types"
import IdeasWithEphemeralGroupingIds from "../services/ideas_with_ephemeral_grouping_ids"

import styles from "./css_modules/grouping_stage.css"

class GroupingStage extends Component {
  constructor(props) {
    super(props)
    window.scrollTo(0, 0)
  }

  render() {
    const { ideas, actions, userOptions } = this.props

    const ideasWithEphemeralGroupingIds = IdeasWithEphemeralGroupingIds.buildFrom(ideas)

    return (
      <div className={styles.wrapper}>
        <GroupingBoard
          ideas={ideasWithEphemeralGroupingIds}
          actions={actions}
          userOptions={userOptions}
        />

        <div className="ui dimmer visible transition active device">
          <div className="content">
            <h3 className="ui inverted icon header device">
              Rotate your device!
              <p className="sub header">You're in portrait mode; this stage requires landscape!</p>
              <i className="mobile alternate icon" />
            </h3>
          </div>
        </div>

        <div className="ui dimmer visible transition active non-device">
          <div className="content">
            <h3 className="ui inverted icon header">
              <i className="expand arrows alternate icon" />
              Expand this window!
              <p className="sub header">This stage requires a wide viewport!</p>
            </h3>
          </div>
        </div>

        <LowerThird {...this.props} />
      </div>
    )
  }
}

GroupingStage.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  actions: PropTypes.object.isRequired,
  userOptions: AppPropTypes.userOptions.isRequired,
}

export default GroupingStage
