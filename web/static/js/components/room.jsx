import React, { Component, PropTypes } from "react"

import UserList from "./user_list"
import CategoryColumn from "./category_column"
import IdeaSubmissionForm from "./idea_submission_form"
import ActionItemToggle from "./action_item_toggle"
import DoorChime from "./door_chime"
import * as AppPropTypes from "../prop_types"

import styles from "./css_modules/room.css"

class Room extends Component {
  constructor(props) {
    super(props)
    this.state = { ideas: [], showActionItem: false }
    this.handleIdeaSubmission = this.handleIdeaSubmission.bind(this)
    this.handleToggleActionItem = this.handleToggleActionItem.bind(this)
  }

  componentDidMount() {
    this.props.retroChannel.on("existing_ideas", (payload) => {
      this.setState({ ideas: payload.ideas })
    })

    this.props.retroChannel.on("new_idea_received", (newIdea) => {
      this.setState({ ideas: [...this.state.ideas, newIdea] })
    })
  }

  handleIdeaSubmission(idea) {
    this.props.retroChannel.push("new_idea", idea)
  }

  handleToggleActionItem() {
    this.setState({ showActionItem: !this.state.showActionItem })
  }

  render() {
    const { currentUser, users } = this.props
    const { ideas, showActionItem } = this.state
    return (
      <section className={styles.wrapper}>
        <div className={`ui equal width padded grid ${styles.categoryColumnsWrapper}`}>
          <CategoryColumn category="happy" currentUser={currentUser} ideas={ideas} />
          <CategoryColumn category="sad" currentUser={currentUser} ideas={ideas} />
          <CategoryColumn category="confused" currentUser={currentUser} ideas={ideas} />
          { showActionItem ? <CategoryColumn category="action-item" ideas={ideas} /> : null }
        </div>

        <UserList users={users} />
        <div className="ui stackable grid basic attached secondary segment">
          <div className="thirteen wide column">
            <IdeaSubmissionForm onIdeaSubmission={this.handleIdeaSubmission} showActionItem={showActionItem} />
          </div>
          <div className="three wide column">
            <ActionItemToggle onToggleActionItem={this.handleToggleActionItem} />
          </div>
        </div>
        <DoorChime users={users} />
      </section>
    )
  }
}

Room.propTypes = {
  currentUser: PropTypes.string.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  users: AppPropTypes.users.isRequired,
}

export default Room
