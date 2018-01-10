import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"

import * as AppPropTypes from "../prop_types"
import Room from "./room"
import Alert from "./alert"
import DoorChime from "./door_chime"

export class RemoteRetro extends Component {
  // Trigger analytics events on page load and stage changes
  componentDidMount() {
    hj("trigger", this.props.stage)
  }

  componentDidUpdate(prevProps) {
    const { stage } = this.props
    if (prevProps.stage !== stage) { hj("trigger", stage) }
  }

  render() {
    const { presences, ideas, userToken, retroChannel, stage, alert } = this.props
    const currentUser = presences.find(user => user.token === userToken)

    return (
      <div className={stage}>
        <Room
          currentUser={currentUser}
          presences={presences}
          ideas={ideas}
          stage={stage}
          retroChannel={retroChannel}
        />
        <Alert config={alert} />
        <DoorChime presences={presences} />
      </div>
    )
  }
}

RemoteRetro.propTypes = {
  retroChannel: AppPropTypes.retroChannel.isRequired,
  presences: AppPropTypes.presences,
  ideas: AppPropTypes.ideas,
  userToken: PropTypes.string.isRequired,
  stage: AppPropTypes.stage.isRequired,
  alert: PropTypes.object,
}

RemoteRetro.defaultProps = {
  presences: [],
  ideas: [],
  alert: null,
}

const mapStateToProps = state => ({ ...state })

export default connect(
  mapStateToProps
)(RemoteRetro)
