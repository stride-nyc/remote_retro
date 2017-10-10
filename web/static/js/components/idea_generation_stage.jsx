import React, { Component } from "react"

import * as AppPropTypes from "../prop_types"
import UserList from "./user_list"
import IdeaBoard from "./idea_board"
import LowerThird from "./lower_third"

import styles from "./css_modules/idea_generation_stage.css"

class IdeaGenerationStage extends Component {
  componentDidMount() {
    hj("trigger", this.props.stage)
  }

  render() {
    const { props } = this

    return (
      <div className={styles.wrapper}>
        <IdeaBoard {...props} />
        <UserList {...props} />
        <LowerThird {...props} />
      </div>
    )
  }
}

IdeaGenerationStage.propTypes = {
  stage: AppPropTypes.stage.isRequired,
}

export default IdeaGenerationStage
