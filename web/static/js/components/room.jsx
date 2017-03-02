import React, { Component } from "react"

import UserList from "./user_list"
import CategoryColumn from "./category_column"
import IdeaSubmissionForm from "./idea_submission_form"
import chimeSound from "./chime_sound"

import styles from "./css_modules/room.css"

class Room extends Component {
  constructor(props) {
    super(props)
    this.state = { ideas: [] }
    this.handleIdeaSubmission = this.handleIdeaSubmission.bind(this)
  }

  componentDidMount() {
    this.props.retroChannel.on("existing_ideas", (payload) => {
      this.setState({ ideas: payload.ideas })
    })

    this.props.retroChannel.on("new_idea_received", (newIdea) => {
      this.setState({ ideas: [...this.state.ideas, newIdea] })
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.users.length !== nextProps.users.length) {
      this.chime.play()
    }
  }

  handleIdeaSubmission(idea) {
    this.props.retroChannel.push("new_idea", idea)
  }

  render() {
    return (
      <section className={styles.wrapper}>
        <div className={`ui equal width padded grid ${styles["category-columns-wrapper"]}`}>
          <CategoryColumn category="happy" ideas={this.state.ideas} />
          <CategoryColumn category="sad" ideas={this.state.ideas} />
          <CategoryColumn category="confused" ideas={this.state.ideas} />
          <CategoryColumn category="action-item" ideas={this.state.ideas} />
        </div>

        <UserList users={this.props.users} />
        <IdeaSubmissionForm onIdeaSubmission={this.handleIdeaSubmission} />
        <audio
          ref={audio => { this.chime = audio }}
          src={chimeSound} />
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
