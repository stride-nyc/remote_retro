import React, { Component } from "react"

import UserList from "./user_list"
import CategoryColumn from "./category_column"
import IdeaSubmissionForm from "./idea_submission_form"
import ActionItemToggle from "./action_item_toggle"
import DoorChime from "./door_chime"

import styles from "./css_modules/room.css"

class Room extends Component {
  constructor(props) {
    super(props)
    this.state = { ideas: [], showActionItem: false }
    this.handleIdeaSubmission = this.handleIdeaSubmission.bind(this)
    this.handleIdeaDeletion = this.handleIdeaDeletion.bind(this)
    this.handleToggleActionItem = this.handleToggleActionItem.bind(this)
    this._removeIdea = this._removeIdea.bind(this)
  }

  componentDidMount() {
    this.props.retroChannel.on("existing_ideas", (payload) => {
      this.setState({ ideas: payload.ideas })
    })

    this.props.retroChannel.on("new_idea_received", (newIdea) => {
      this.setState({ ideas: [...this.state.ideas, newIdea] })
    })

    this.props.retroChannel.on("idea_deleted", idea => {
      this.setState({ ideas: this._removeIdea(this.state.ideas, idea.id)})
    })
  }

  _removeIdea(ideas, id) {
    let index = ideas.map(idea => idea.id).indexOf(id)
    if (index == -1) {
      return ideas
    }

    return [
      ...ideas.slice(0, index),
      ...ideas.slice(index+1)
    ]
  }

  handleIdeaSubmission(idea) {
    this.props.retroChannel.push("new_idea", idea)
  }

  handleIdeaDeletion(idea_id) {
    this._removeIdea(this.state.ideas, idea_id)
    this.props.retroChannel.push("delete_idea", idea_id)
  }

  handleToggleActionItem() {
    this.setState({ showActionItem: !this.state.showActionItem })
  }

  render() {
    return (
      <section className={styles.wrapper}>
        <div className={`ui equal width padded grid ${styles["category-columns-wrapper"]}`}>
          <CategoryColumn category="happy" ideas={this.state.ideas} onIdeaDelete={this.handleIdeaDeletion}/>
          <CategoryColumn category="sad" ideas={this.state.ideas} onIdeaDelete={this.handleIdeaDeletion}/>
          <CategoryColumn category="confused" ideas={this.state.ideas} onIdeaDelete={this.handleIdeaDeletion}/>
          { this.state.showActionItem ? <CategoryColumn category="action-item" ideas={this.state.ideas} /> : null }
        </div>

        <UserList users={this.props.users} />
        <div className="ui stackable grid basic attached secondary segment">
          <div className="thirteen wide column">
            <IdeaSubmissionForm onIdeaSubmission={this.handleIdeaSubmission} showActionItem={this.state.showActionItem} />
          </div>
          <div className="three wide column">
            <ActionItemToggle onToggleActionItem={this.handleToggleActionItem} />
          </div>
        </div>
        <DoorChime users={this.props.users} />
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
