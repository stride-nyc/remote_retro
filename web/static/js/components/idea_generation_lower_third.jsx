import React from "react"
import classNames from "classnames"
import { CSSTransitionGroup } from "react-transition-group"

import IdeaSubmissionForm from "./idea_submission_form"
import StageProgressionButton from "./stage_progression_button"
import stageProgressionConfigs from "../configs/stage_progression_configs"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_generation_lower_third.css"

const IdeaGenerationLowerThird = props => {
  const { stage, currentUser, ideas, ui } = props
  const isFacilitator = currentUser.is_facilitator
  const progressionConfig = stageProgressionConfigs[stage]
  const showActionItem = stage !== "idea-generation"
  const buttonColumnClasses = classNames("three wide right aligned column", {
    [styles.alignButton]: ui.submitIdeaPromptPointerVisible,
  })

  function wereActionItemsSubmitted() {
    return showActionItem && !ideas.some(idea => idea.category === "action-item")
  }

  return (
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
        <div className={buttonColumnClasses}>
          { isFacilitator &&
            <StageProgressionButton
              {...props}
              config={progressionConfig}
              buttonDisabled={wereActionItemsSubmitted()}
            />
          }
        </div>
        <p className={styles.poweredBy}>
          Built by <a href="http://www.stridenyc.com/">Stride Consulting</a> and Open Source Badasses
        </p>
      </div>
    </CSSTransitionGroup>
  )
}

IdeaGenerationLowerThird.defaultProps = {
  currentUser: { is_facilitator: false },
}

IdeaGenerationLowerThird.propTypes = {
  currentUser: AppPropTypes.user,
  ideas: AppPropTypes.ideas.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: React.PropTypes.string.isRequired,
  ui: React.PropTypes.object.isRequired,
}

export default IdeaGenerationLowerThird
