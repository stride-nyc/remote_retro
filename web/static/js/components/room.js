import React, { Component } from "react"

import UserList from "./user_list"
import IdeaSubmissionForm from "./idea_submission_form"

class Room extends Component {
  constructor() {
    super()
    this.handleIdeaSubmission = this.handleIdeaSubmission.bind(this)
  }

  handleIdeaSubmission(idea) {
    console.log(idea)
  }

  render() {
    return (
      <div>
        <UserList users={ this.props.users } />
        <IdeaSubmissionForm user={ this.props.user } onIdeaSubmission={ this.handleIdeaSubmission }/>
      </div>
    )
  }
}

export default Room
