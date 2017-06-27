import React from "react"
import { CSSTransitionGroup } from "react-transition-group"

import UserList from "./user_list"
import CategoryColumn from "./category_column"
import IdeaSubmissionForm from "./idea_submission_form"
import StageProgressionButton from "./stage_progression_button"
import stageProgressionConfigs from "../configs/stage_progression_configs"

import DoorChime from "./door_chime"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/room.css"

const Room = props => {
  const { currentUser, users, stage } = props
  const isFacilitator = currentUser.is_facilitator
  const progressionConfig = stageProgressionConfigs[stage]
  const categories = ["happy", "sad", "confused"]
  const showActionItem = stage !== "idea-generation"
  if (showActionItem) { categories.push("action-item") }

  const categoryColumns = categories.map(category => (
    <CategoryColumn {...props} category={category} key={category} />
  ))

  return (
    <section className={styles.wrapper}>
      <div className={`ui equal width padded grid ${styles.categoryColumnsWrapper}`}>
        { categoryColumns }
      </div>

      <UserList users={users} />
      <CSSTransitionGroup
        transitionName={{ appear: styles.appear, appearActive: styles.appearActive }}
        transitionAppear
        transitionAppearTimeout={700}
        transitionEnter={false}
        transitionLeave={false}
      >
        <div className="ui stackable grid basic attached secondary center aligned segment">
          <div className="thirteen wide column">
            <IdeaSubmissionForm {...props} showActionItem={showActionItem} />
          </div>
          <div className="three wide right aligned column">
            { isFacilitator && <StageProgressionButton {...props} config={progressionConfig} /> }
          </div>
          <p className={styles.poweredBy}>
            Built by <a href="http://www.stridenyc.com/">Stride Consulting</a> and Open Source Badasses
          </p>
        </div>
      </CSSTransitionGroup>
      <DoorChime users={users} />
    </section>
  )
}

Room.defaultProps = {
  currentUser: { is_facilitator: false },
}

Room.propTypes = {
  currentUser: AppPropTypes.user,
  ideas: AppPropTypes.ideas.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: React.PropTypes.string.isRequired,
  users: AppPropTypes.users.isRequired,
}

export default Room
