import React from "react"
import { connect } from "react-redux"
import { selectors } from "../redux/index"

import LowerThird from "./lower_third"
import IdeaGroup from "./idea_group"

import * as AppPropTypes from "../prop_types"

import styles from "./css_modules/group_labeling_stage.css"

export const GroupLabelingStage = props => {
  const { groupsWithAssociatedIdeas, currentUser, actions } = props

  return (
    <div className={styles.wrapper}>
      <div className={styles.groupsWrapper}>
        {groupsWithAssociatedIdeas.map(groupWithAssociatedIdeas => (
          <IdeaGroup
            actions={actions}
            currentUser={currentUser}
            key={groupWithAssociatedIdeas.id}
            groupWithAssociatedIdeas={groupWithAssociatedIdeas}
          />
        ))}
      </div>

      <LowerThird {...props} />
    </div>
  )
}

GroupLabelingStage.propTypes = {
  actions: AppPropTypes.actions.isRequired,
  currentUser: AppPropTypes.user.isRequired,
  groupsWithAssociatedIdeas: AppPropTypes.groups.isRequired,
}

const mapStateToProps = state => ({
  groupsWithAssociatedIdeas: selectors.groupsWithAssociatedIdeas(state),
})

export default connect(mapStateToProps)(GroupLabelingStage)
