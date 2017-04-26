import React, { Component, PropTypes } from "react"
import { Presence } from "phoenix"
import update from "immutability-helper"

import * as AppPropTypes from "../prop_types"
import Room from "./room"

const updateIdeas = (ideas, idOfIdeaToUpdate, newAttributes) => {
  const index = ideas.findIndex(idea => idOfIdeaToUpdate === idea.id)
  return update(ideas, {
    [index]: { $set: { ...ideas[index], ...newAttributes } },
  })
}

class RemoteRetro extends Component {
  constructor(props) {
    super(props)
    this.state = {
      presences: {},
      ideas: [],
      stage: "idea-generation",
    }
  }

  componentWillMount() {
    const { retroChannel } = this.props

    retroChannel.join()
      .receive("error", error => console.error(error))

    retroChannel.on("presence_state", presences => this.setState({ presences }))

    retroChannel.on("existing_ideas", payload => {
      this.setState({ ideas: payload.ideas })
    })

    retroChannel.on("new_idea_received", newIdea => {
      this.setState({ ideas: [...this.state.ideas, newIdea] })
    })

    retroChannel.on("proceed_to_next_stage", payload => {
      this.setState({ stage: payload.stage })
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

    retroChannel.on("email_send_status", payload => {
      const successMessage = "Consider it done. Participants will receive an email breakdown of the action items shortly."
      const errorMessage = "It seems there was an error. Please try to send the action items again in a few minutes. Thanks for your patience."
      alert(payload.success ? successMessage : errorMessage)
    })
  }

  render() {
    const { userToken, retroChannel } = this.props
    const { presences, ideas, stage } = this.state

    const users = Presence.list(presences, (_username, presence) => (presence.user))
    const currentPresence = presences[userToken]

    return (
      <Room
        currentPresence={currentPresence}
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
  userToken: PropTypes.string.isRequired,
}

export default RemoteRetro
