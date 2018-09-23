import React, { Component } from "react"
import { bindActionCreators } from "redux"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { actions, selectors } from "../redux"

import * as AppPropTypes from "../prop_types"
import Room from "./room"
import Alert from "./alert"
import Error from "./error"
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
      error,
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
        <Error config={error} />
        <DoorChime presences={presences} />
      </div>
    )
  }
}

RemoteRetro.propTypes = {
  retroChannel: AppPropTypes.retroChannel.isRequired,
  presences: AppPropTypes.presences.isRequired,
  ideas: AppPropTypes.ideas.isRequired,
  stage: AppPropTypes.stage.isRequired,
  alert: PropTypes.object,
  error: PropTypes.object,
  actions: AppPropTypes.actions.isRequired,
  currentUser: AppPropTypes.presence,
  facilitatorName: PropTypes.string.isRequired,
}

RemoteRetro.defaultProps = {
  /*
  / account for initial render occurring before ephemeral 'presence' state
  / is sent by server, as that event necessarily arrives *after*
  / the channel is joined
  */
  currentUser: {
    is_facilitator: false,
    token: window.userToken,
  },
  facilitatorName: "",
  alert: null,
  error: null,
}

const mapStateToProps = state => {
  const { stage, facilitator_id } = state.retro
  return {
    ...state,
    stage,
    currentUser: selectors.getCurrentUserPresence(state),
    facilitatorName: selectors.getUserById(state, facilitator_id).name,
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoteRetro)
