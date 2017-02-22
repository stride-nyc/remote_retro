import React, { Component } from "react"

import UserList from "./user_list"
import CategoryColumn from "./category_column"
import IdeaSubmissionForm from "./idea_submission_form"

class Room extends Component {
  constructor(props) {
    super(props)
    this.state = { ideas: [] }
    this.handleIdeaSubmission = this.handleIdeaSubmission.bind(this)
  }

  componentDidMount() {
    this.props.retroChannel.on("existing_ideas", (payload) => {
      this.setState({ ideas: [...this.state.ideas, ...payload.ideas] })
    })

    this.props.retroChannel.on("new_idea_received", (newIdea) => {
      this.setState({ ideas: [...this.state.ideas, newIdea] })
    })
  }

  handleIdeaSubmission(idea) {
    this.props.retroChannel.push("new_idea", idea)
  }

  render() {
    return (
      <section className="room">
        <div className="ui equal width padded grid category-columns-wrapper">
          <CategoryColumn category="happy" ideas={this.state.ideas} />
          <CategoryColumn category="sad" ideas={this.state.ideas} />
          <CategoryColumn category="confused" ideas={this.state.ideas} />
          <CategoryColumn category="action-item" ideas={this.state.ideas} />
        </div>

        <UserList users={this.props.users} />
        <IdeaSubmissionForm onIdeaSubmission={this.handleIdeaSubmission} />
      </section>
    )
  }
}

Room.propTypes = {
  retroChannel: React.PropTypes.shape({
    on: React.PropTypes.func,
    push: React.PropTypes.func,
  }).isRequired,
  users: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      name: React.PropTypes.string,
      online_at: React.PropTypes.number,
    }),
  ).isRequired,
}

export default Room
