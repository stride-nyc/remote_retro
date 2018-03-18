import React, { Component } from "react"
import { bindActionCreators } from "redux"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { actions, selectors } from "../redux"

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
    const {
      presences,
      ideas,
      retroChannel,
      stage,
      alert,
      currentUser,
      facilitatorName,
    } = this.props

    return (
      <div className={stage}>
        <Room
          currentUser={currentUser}
          facilitatorName={facilitatorName}
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
  actions: PropTypes.object,
  currentUser: AppPropTypes.presence.isRequired,
  facilitatorName: PropTypes.string.isRequired,
}

RemoteRetro.defaultProps = {
  currentUser: {},
  presences: [],
  ideas: [],
  alert: null,
  actions: {},
}

const mapStateToProps = state => ({
  ...state,
  currentUser: selectors.findCurrentUser(state),
  facilitatorName: selectors.getUserById(state, state.facilitatorId).name,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoteRetro)
