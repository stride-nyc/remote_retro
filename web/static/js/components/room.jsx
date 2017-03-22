import React, { Component } from "react"

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

    this.props.retroChannel.on("set_show_action_item", (eventPayload) => {
      this.setState({ showActionItem: eventPayload.show_action_item })
    })
  }

  handleIdeaSubmission(idea) {
    this.props.retroChannel.push("new_idea", idea)
  }

  handleToggleActionItem() {
    this.props.retroChannel.push(
      "show_action_item",
      { show_action_item: !this.state.showActionItem },
    )
  }

  render() {
    return (
      <section className={styles.wrapper}>
        <div className={`ui equal width padded grid ${styles.categoryColumnsWrapper}`}>
          <CategoryColumn category="happy" ideas={this.state.ideas} />
          <CategoryColumn category="sad" ideas={this.state.ideas} />
          <CategoryColumn category="confused" ideas={this.state.ideas} />
          { this.state.showActionItem
            ? <CategoryColumn category="action-item" ideas={this.state.ideas} /> : null
          }
        </div>

        <UserList users={this.props.users} />
        <div className="ui stackable grid basic attached secondary segment">
          <div className="thirteen wide column">
            <IdeaSubmissionForm
              onIdeaSubmission={this.handleIdeaSubmission}
              showActionItem={this.state.showActionItem}
            />
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

Room.defaultProps = {
  isFacilitator: false,
}

Room.propTypes = {
  retroChannel: AppPropTypes.retroChannel.isRequired,
  users: AppPropTypes.users.isRequired,
  isFacilitator: React.PropTypes.bool,
}

export default Room
