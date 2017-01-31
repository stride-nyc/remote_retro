import React, { Component } from "react"

import UserList from "./user_list"
import CategoryColumn from "./category_column"
import IdeaSubmissionForm from "./idea_submission_form"

class Room extends Component {
  constructor(props) {
    super(props)
    this.state = { ideas: [] }
    this.handleIdeaSubmission = this.handleIdeaSubmission.bind(this)
    this._setupRoomChannelEventHandlers()
  }

  _setupRoomChannelEventHandlers() {
    this.props.roomChannel.on("new_idea_received", newIdea => {
      this.setState({ ideas: [...this.state.ideas, newIdea] })
    })
  }

  handleIdeaSubmission(idea) {
    this.props.roomChannel.push("new_idea", idea)
  }

  render() {
    return (
      <section className="room">
        <div className="ui equal width padded grid category-columns-wrapper">
          <CategoryColumn category="happy" ideas={ this.state.ideas }/>
          <CategoryColumn category="sad" ideas={ [] }/>
          <CategoryColumn category="confused" ideas={ [] }/>
        </div>

        <UserList users={ this.props.users } />
        <IdeaSubmissionForm onIdeaSubmission={ this.handleIdeaSubmission }/>
      </section>
    )
  }
}

Room.propTypes = {
  roomChannel: React.PropTypes.object.isRequired,
  users: React.PropTypes.array.isRequired,
}

export default Room
