import React, { Component } from "react"

import UserList from "./user_list"
import IdeaSubmissionForm from "./idea_submission_form"

class Room extends Component {
  constructor() {
    super()
    this.handleIdeaSubmission = this.handleIdeaSubmission.bind(this)
  }

  handleIdeaSubmission(idea) {
    this.props.roomChannel.push("new_idea", { body: idea })
  }

  render() {
    return (
      <div>
        <UserList users={ this.props.users } />
        <IdeaSubmissionForm onIdeaSubmission={ this.handleIdeaSubmission }/>
      </div>
    )
  }
}

Room.propTypes = {
  roomChannel: React.PropTypes.object.isRequired,
}

export default Room
