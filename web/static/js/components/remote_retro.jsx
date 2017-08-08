import React, { PropTypes } from "react"
import { connect } from "react-redux"

import * as AppPropTypes from "../prop_types"
import Room from "./room"
import Alert from "./alert"
import ShareRetroLinkModal from "./share_retro_link_modal"
import DoorChime from "./door_chime"

export const RemoteRetro = props => {
  const { users, ideas, userToken, retroChannel, stage, insertedAt, alert } = props

  const currentUser = users.find(user => user.token === userToken)

  return (
    <div>
      <Room
        currentUser={currentUser}
        users={users}
        ideas={ideas}
        stage={stage}
        retroChannel={retroChannel}
      />
      <Alert config={alert} />
      <ShareRetroLinkModal retroCreationTimestamp={insertedAt} />
      <DoorChime {...props} />
    </div>
  )
}

RemoteRetro.propTypes = {
  retroChannel: AppPropTypes.retroChannel.isRequired,
  users: AppPropTypes.users,
  ideas: AppPropTypes.ideas,
  userToken: PropTypes.string.isRequired,
  stage: PropTypes.string.isRequired,
  insertedAt: PropTypes.string,
  alert: PropTypes.object,
}

RemoteRetro.defaultProps = {
  users: [],
  ideas: [],
  insertedAt: null,
  alert: null,
}

const mapStateToProps = state => ({ ...state })

export default connect(
  mapStateToProps
)(RemoteRetro)
