import React, { Component, PropTypes } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { Presence } from "phoenix"

import * as userActionCreators from "../actions/user"
import * as AppPropTypes from "../prop_types"
import Room from "./room"

const updateIdeas = (ideas, idOfIdeaToUpdate, newAttributes) => {
  return ideas.map(idea => {
    return (idea.id === idOfIdeaToUpdate) ? { ...idea, ...newAttributes } : idea
  })
}

export class RemoteRetro extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ideas: [],
      stage: "idea-generation",
    }
  }

  componentWillMount() {
    const { retroChannel, actions } = this.props

    retroChannel.join()
      .receive("ok", retroState => { this.setState(retroState) })
      .receive("error", error => console.error(error))

    retroChannel.on("presence_state", presences => {
      const users = Presence.list(presences, (_username, presence) => (presence.user))
      actions.addUsers(users)
    })

    retroChannel.on("new_idea_received", newIdea => {
      this.setState({ ideas: [...this.state.ideas, newIdea] })
    })

    retroChannel.on("proceed_to_next_stage", payload => {
      this.setState({ stage: payload.stage })
      if (payload.stage === "action-item-distribution") {
        alert(
          "The facilitator has distibuted this retro's action items. You will receive an email breakdown shortly."
        )
      }
    })

    retroChannel.on("user_typing_idea", payload => {
      actions.updateUser(payload.userToken, { is_typing: true, last_typed: Date.now() })

      const interval = setInterval(() => {
        const { users } = this.props
        const user = users.find(user => user.token === payload.userToken)
        const noNewTypingEventsReceived = (Date.now() - user.last_typed) > 650
        if (noNewTypingEventsReceived) {
          clearInterval(interval)
          actions.updateUser(user.token, { is_typing: false })
        }
      }, 10)
    })

    retroChannel.on("enable_edit_state", nominatedIdea => {
      const newIdeas = updateIdeas(this.state.ideas, nominatedIdea.id, { editing: true })
      this.setState({ ideas: newIdeas })
    })

    retroChannel.on("disable_edit_state", disabledIdea => {
      const { ideas } = this.state
      const newIdeas = updateIdeas(ideas, disabledIdea.id, { editing: false, liveEditText: null })
      this.setState({ ideas: newIdeas })
    })

    retroChannel.on("idea_live_edit", editedIdea => {
      const newIdeas = updateIdeas(this.state.ideas, editedIdea.id, editedIdea)
      this.setState({ ideas: newIdeas })
    })

    retroChannel.on("idea_edited", editedIdea => {
      const updatedIdea = { ...editedIdea, editing: false, liveEditText: null }
      const newIdeas = updateIdeas(this.state.ideas, editedIdea.id, updatedIdea)
      this.setState({ ideas: newIdeas })
    })

    retroChannel.on("idea_deleted", deletedIdea => {
      const ideas = this.state.ideas.filter(idea => idea.id !== deletedIdea.id)
      this.setState({ ideas })
    })
  }

  render() {
    const { users, userToken, retroChannel } = this.props
    const { ideas, stage } = this.state

    const currentUser = users.find(user => user.token === userToken)

    return (
      <Room
        currentUser={currentUser}
        users={users}
        ideas={ideas}
        stage={stage}
        retroChannel={retroChannel}
      />
    )
  }
}

RemoteRetro.propTypes = {
  retroChannel: AppPropTypes.retroChannel.isRequired,
  users: AppPropTypes.users,
  userToken: PropTypes.string.isRequired,
}

RemoteRetro.defaultProps = {
  users: [],
}

const mapStateToProps = state => ({
  users: state.user,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(userActionCreators, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoteRetro)
