import React, { Component } from "react"
import { bindActionCreators } from "redux"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import * as alertActionCreators from "../actions/alert"

import * as AppPropTypes from "../prop_types"
import Room from "./room"
import Alert from "./alert"
import DoorChime from "./door_chime"

function isNewFacilitator(prevCurrentUser, currentUser) {
  return ((prevCurrentUser.is_facilitator !== currentUser.is_facilitator)
    && currentUser.is_facilitator)
}

function findCurrentUser(presences, userToken) {
  return presences.find(user => user.token === userToken)
}

function findFacilitatorName(presences) {
  return presences.find(user => user.is_facilitator).name
}

export class RemoteRetro extends Component {
  // Trigger analytics events on page load and stage changes
  componentDidMount() {
    hj("trigger", this.props.stage)
  }

  componentDidUpdate(prevProps) {
    const { stage, actions } = this.props
    if (prevProps.stage !== stage) { hj("trigger", stage) }

    if (prevProps.presences.length) {
      const prevCurrentUser = findCurrentUser(prevProps.presences, prevProps.userToken)
      const currentUser = findCurrentUser(this.props.presences, this.props.userToken)
      if (isNewFacilitator(prevCurrentUser, currentUser)) {
        actions.changeFacilitator(findFacilitatorName(prevProps.presences))
      }
    }
  }

  render() {
    const { presences, ideas, userToken, retroChannel, stage, alert } = this.props
    const currentUser = findCurrentUser(presences, userToken)

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
}

RemoteRetro.defaultProps = {
  presences: [],
  ideas: [],
  alert: null,
  actions: {},
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(alertActionCreators, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoteRetro)
