import React from "react"

import UserList from "./user_list"
import CategoryColumn from "./category_column"
import IdeaSubmissionForm from "./idea_submission_form"
import StageProgressionButton from "./stage_progression_button"
import stageProgressionConfigs from "../configs/stage_progression_configs"

import DoorChime from "./door_chime"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/room.css"

function Room(props) {
  const { currentPresence, users, retroChannel, ideas, stage } = props
  const isFacilitator = currentPresence.user.is_facilitator
  const categories = ["happy", "sad", "confused"]
  const showActionItem = stage !== "idea-generation"
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
      <div className="ui stackable grid basic attached secondary center aligned segment">
        <div className="thirteen wide column">
          <IdeaSubmissionForm
            currentPresence={currentPresence}
            retroChannel={retroChannel}
            showActionItem={showActionItem}
          />
        </div>
        <div className="three wide right aligned column">
          {
            isFacilitator &&
            <StageProgressionButton
              stageProgressionConfigs={stageProgressionConfigs}
              retroChannel={retroChannel}
              stage={stage}
            />
          }
        </div>
        <p className={styles.poweredBy}>
          Built by <a href="http://www.stridenyc.com/">Stride Consulting</a> and Open Source Badasses
        </p>
      </div>
      <DoorChime users={users} />
    </section>
  )
}

Room.defaultProps = {
  currentPresence: {
    user: { is_facilitator: false },
  },
}

Room.propTypes = {
  currentPresence: AppPropTypes.presence,
  ideas: AppPropTypes.ideas.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: React.PropTypes.string.isRequired,
  users: AppPropTypes.users.isRequired,
}

export default Room
