import React, { Component, PropTypes } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { Presence } from "phoenix"

import * as userActionCreators from "../actions/user"
import * as ideaActionCreators from "../actions/idea"
import * as retroActionCreators from "../actions/retro"
import * as AppPropTypes from "../prop_types"
import Room from "./room"
import Alert from "./alert"
import ShareRetroLinkModal from "./share_retro_link_modal"
import UserActivity from "../services/user_activity"

export class RemoteRetro extends Component {
  componentWillMount() {
    const { retroChannel, actions } = this.props

    retroChannel.join()
      .receive("ok", actions.setInitialState)
      .receive("error", error => console.error(error))

    retroChannel.on("presence_state", presences => {
      const users = Presence.list(presences, (_userToken, presence) => (presence.user))
      actions.setUsers(users)
    })

    retroChannel.on("presence_diff", actions.syncPresenceDiff)

    retroChannel.on("new_idea_received", newIdea => {
      actions.addIdea(newIdea)
    })

    retroChannel.on("proceed_to_next_stage", payload => {
      actions.updateStage(payload.stage)
      if (payload.stage === "action-item-distribution") {
        alert(
          "The facilitator has distibuted this retro's action items. You will receive an email breakdown shortly."
        )
      }
    })

    retroChannel.on("user_typing_idea", ({ userToken }) => {
      actions.updateUser(userToken, { is_typing: true, last_typed: Date.now() })
      UserActivity.checkIfDoneTyping(this, userToken, () => {
        actions.updateUser(userToken, { is_typing: false })
      })
    })

    retroChannel.on("enable_edit_state", nominatedIdea => {
      actions.updateIdea(nominatedIdea.id, { editing: true })
    })

    retroChannel.on("disable_edit_state", disabledIdea => {
      actions.updateIdea(disabledIdea.id, { editing: false, liveEditText: null })
    })

    retroChannel.on("idea_live_edit", editedIdea => {
      actions.updateIdea(editedIdea.id, editedIdea)
    })

    retroChannel.on("idea_edited", editedIdea => {
      const updatedIdea = { ...editedIdea, editing: false, liveEditText: null }
      actions.updateIdea(editedIdea.id, updatedIdea)
    })

    retroChannel.on("idea_deleted", deletedIdea => {
      actions.deleteIdea(deletedIdea.id)
    })

    retroChannel.on("idea_highlighted", highlightedIdea => {
      actions.updateIdea(highlightedIdea.id, { isHighlighted: !highlightedIdea.isHighlighted })
    })
  }

  render() {
    const { users, ideas, userToken, retroChannel, stage, insertedAt, alertConfig } = this.props

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
        <Alert config={alertConfig} />
        <ShareRetroLinkModal retroCreationTimestamp={insertedAt} />
      </div>
    )
  }
}

RemoteRetro.propTypes = {
  actions: PropTypes.object.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  users: AppPropTypes.users,
  ideas: AppPropTypes.ideas,
  userToken: PropTypes.string.isRequired,
  stage: PropTypes.string.isRequired,
  insertedAt: PropTypes.string,
}

RemoteRetro.defaultProps = {
  users: [],
  ideas: [],
  insertedAt: null,
}

const mapStateToProps = state => ({
  users: state.user,
  ideas: state.idea,
  stage: state.stage,
  insertedAt: state.insertedAt,
  alertConfig: state.alertConfig,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...userActionCreators,
    ...ideaActionCreators,
    ...retroActionCreators,
  }, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoteRetro)
