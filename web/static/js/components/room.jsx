import React, { Component } from "react"
import update from "immutability-helper"

import UserList from "./user_list"
import CategoryColumn from "./category_column"
import IdeaSubmissionForm from "./idea_submission_form"
import StageProgressionButton from "./stage_progression_button"
import DoorChime from "./door_chime"
import * as AppPropTypes from "../prop_types"

import styles from "./css_modules/room.css"

class Room extends Component {
  constructor(props) {
    super(props)
    this.state = { ideas: [], showActionItem: false }
  }

  componentDidMount() {
    this.props.retroChannel.on("existing_ideas", payload => {
      this.setState({ ideas: payload.ideas })
    })

    this.props.retroChannel.on("new_idea_received", newIdea => {
      this.setState({ ideas: [...this.state.ideas, newIdea] })
    })

    this.props.retroChannel.on("set_show_action_item", eventPayload => {
      this.setState({ showActionItem: eventPayload.show_action_item })
    })

    this.props.retroChannel.on("enable_edit_state", nominatedIdea => {
      const newIdeas = updateIdeas(this.state.ideas, nominatedIdea.id, { editing: true })
      this.setState({ ideas: newIdeas })
    })

    this.props.retroChannel.on("disable_edit_state", disabledIdea => {
      const newIdeas = updateIdeas(this.state.ideas, disabledIdea.id, { editing: false })
      this.setState({ ideas: newIdeas })
    })

    this.props.retroChannel.on("idea_edited", editedIdea => {
      const updatedIdea = { ...editedIdea, editing: false }
      const newIdeas = updateIdeas(this.state.ideas, editedIdea.id, updatedIdea)
      this.setState({ ideas: newIdeas })
    })

    this.props.retroChannel.on("idea_deleted", deletedIdea => {
      const ideas = this.state.ideas.filter(idea => idea.id !== deletedIdea.id)
      this.setState({ ideas })
    })
  }

  render() {
    const { ideas, showActionItem } = this.state
    const { currentPresence, users, retroChannel, isFacilitator } = this.props
    const retroHasYetToProgressToActionItems = !showActionItem
    const categories = ["happy", "sad", "confused"]
    if (showActionItem) { categories.push("action-item") }

    return (
      <section className={styles.wrapper}>
        <div className={`ui equal width padded grid ${styles.categoryColumnsWrapper}`}>
          {
            categories.map(category => (
              <CategoryColumn
                category={category}
                key={category}
                ideas={ideas}
                currentPresence={currentPresence}
                retroChannel={retroChannel}
              />
            ))
          }
        </div>

        <UserList users={users} />
        <div className="ui stackable grid basic attached secondary segment">
          <div className="thirteen wide column">
            <IdeaSubmissionForm
              currentPresence={currentPresence}
              retroChannel={retroChannel}
              showActionItem={showActionItem}
            />
          </div>
          <div className="three wide right aligned column">
            { isFacilitator && retroHasYetToProgressToActionItems &&
              <StageProgressionButton retroChannel={retroChannel} />
            }
          </div>
        </div>
        <DoorChime users={users} />
      </section>
    )
  }
}

const updateIdeas = (ideas, idOfIdeaToUpdate, newAttributes) => {
  const index = ideas.findIndex(idea => idOfIdeaToUpdate === idea.id)
  return update(ideas, {
    [index]: { $set: { ...ideas[index], ...newAttributes } },
  })
}

Room.defaultProps = {
  isFacilitator: false,
}

Room.propTypes = {
  currentPresence: AppPropTypes.presence,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  users: AppPropTypes.users.isRequired,
  isFacilitator: React.PropTypes.bool,
}

export default Room
