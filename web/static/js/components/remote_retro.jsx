import React, { Component } from "react"
import { bindActionCreators } from "redux"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import * as alertActionCreators from "../actions/alert"

import * as AppPropTypes from "../prop_types"
import Room from "./room"
import Alert from "./alert"
import DoorChime from "./door_chime"
import { findCurrentUser, findFacilitatorName } from "../reducers/presences"

export function isNewFacilitator(prevCurrentUser, currentUser) {
  return ((prevCurrentUser.is_facilitator !== currentUser.is_facilitator)
    && currentUser.is_facilitator)
}

export class RemoteRetro extends Component {
  // Trigger analytics events on page load and stage changes
  componentDidMount() {
    hj("trigger", this.props.stage)
  }

  componentDidUpdate(prevProps) {
    const { stage, actions, currentUser } = this.props
    if (prevProps.stage !== stage) { hj("trigger", stage) }

    if (prevProps.presences.length) {
      const prevCurrentUser = prevProps.currentUser
      if (isNewFacilitator(prevCurrentUser, currentUser)) {
        actions.changeFacilitator(prevProps.facilitatorName)
      }
    }
  }

  render() {
    const { presences, ideas, retroChannel, stage, alert, currentUser } = this.props

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
  actions: PropTypes.object,
  currentUser: AppPropTypes.presence,
  facilitatorName: PropTypes.string,
}

RemoteRetro.defaultProps = {
  presences: [],
  ideas: [],
  alert: null,
  actions: {},
}

const mapStateToProps = state => ({
  ...state,
  currentUser: findCurrentUser(state.presences),
  facilitatorName: findFacilitatorName(state.presences),
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(alertActionCreators, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoteRetro)
